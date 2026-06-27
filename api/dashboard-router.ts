import { sql, desc, gte } from "drizzle-orm";
import { orders, comments, contacts } from "@db/schema";
import { getDb } from "./queries/connection";
import { createRouter, adminQuery } from "./middleware";

export const dashboardRouter = createRouter({
  stats: adminQuery.query(async () => {
    const db = getDb();

    const totalOrdersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders);
    const totalOrders = totalOrdersResult[0]?.count || 0;

    const pendingOrdersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(sql`${orders.status} = 'pending'`);
    const pendingOrders = pendingOrdersResult[0]?.count || 0;

    const totalRevenueResult = await db
      .select({ total: sql<number>`COALESCE(sum(${orders.totalAmount}), 0)` })
      .from(orders);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const totalCommentsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(comments);
    const totalComments = totalCommentsResult[0]?.count || 0;

    const pendingCommentsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(comments)
      .where(sql`${comments.approved} = 0`);
    const pendingComments = pendingCommentsResult[0]?.count || 0;

    const totalContactsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(contacts);
    const totalContacts = totalContactsResult[0]?.count || 0;

    return {
      totalOrders,
      pendingOrders,
      totalRevenue,
      totalComments,
      pendingComments,
      totalContacts,
    };
  }),

  recentOrders: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(orders).orderBy(desc(orders.createdAt)).limit(10);
  }),

  recentComments: adminQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(comments)
      .orderBy(desc(comments.createdAt))
      .limit(10);
  }),

  salesData: adminQuery.query(async () => {
    const db = getDb();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await db
      .select({
        date: sql<string>`DATE(${orders.createdAt})`,
        orderCount: sql<number>`count(*)`,
        revenue: sql<number>`COALESCE(sum(${orders.totalAmount}), 0)`,
      })
      .from(orders)
      .where(gte(orders.createdAt, thirtyDaysAgo))
      .groupBy(sql`DATE(${orders.createdAt})`)
      .orderBy(sql`DATE(${orders.createdAt})`);

    return result.map((row) => ({
      date: row.date,
      orders: row.orderCount,
      revenue: row.revenue,
    }));
  }),
});
