import { nodeCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/ptoduct.js";
import { User } from "../models/user.js";
import { calculatePercentage, getInventory, getChartData, } from "../utility/feature.js";
export const getDashStats = TryCatch(async (req, res, next) => {
    let stats;
    const key = "admin-stats";
    if (nodeCache.has(key))
        stats = JSON.parse(nodeCache.get(key));
    else {
        const today = new Date();
        const sixMonthAgo = new Date();
        sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);
        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today,
        };
        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            end: new Date(today.getFullYear(), today.getMonth(), 0),
        };
        const thisMonthProductPromise = Product.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: lastMonth.end,
            },
        });
        const lastMonthProductPromise = Product.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: thisMonth.end,
            },
        });
        const thisMonthUserPromise = User.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: lastMonth.end,
            },
        });
        const lastMonthUserPromise = User.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: thisMonth.end,
            },
        });
        const thisMonthOrderPromise = Order.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: lastMonth.end,
            },
        });
        const lastMonthOrderPromise = Order.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: thisMonth.end,
            },
        });
        const lastSixMonthOrderPromise = Order.find({
            createdAt: {
                $gte: sixMonthAgo,
                $lte: today,
            },
        });
        const latestTransactionPromise = Order.find({})
            .select(["orderItems", "discount", "total", "status"])
            .limit(4);
        const [thisMonthProduct, lastMonthProduct, thisMonthOrder, lastMonthOrder, thisMonthUser, lastMonthUser, productCount, userCount, allOrders, lastSixMonthOrder, categories, femaleUsersCount, latestTransaction,] = await Promise.all([
            thisMonthProductPromise,
            lastMonthProductPromise,
            thisMonthOrderPromise,
            lastMonthOrderPromise,
            thisMonthUserPromise,
            lastMonthUserPromise,
            Product.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("total"),
            lastSixMonthOrderPromise,
            Product.distinct("category"),
            User.countDocuments({ gender: "female" }),
            latestTransactionPromise,
        ]);
        const thisMonthRevenue = thisMonthOrder.reduce((total, order) => total + (order.total || 0), 0);
        const lastMonthRevenue = lastMonthOrder.reduce((total, order) => total + (order.total || 0), 0);
        const changePercent = {
            revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
            product: calculatePercentage(thisMonthProduct.length, lastMonthProduct.length),
            user: calculatePercentage(thisMonthUser.length, lastMonthUser.length),
            order: calculatePercentage(thisMonthOrder.length, lastMonthOrder.length),
        };
        const revenue = allOrders.reduce((total, order) => total + (order.total || 0), 0);
        const count = {
            revenue,
            user: userCount,
            product: productCount,
            order: allOrders.length,
        };
        const orderMonthCount = new Array(6).fill(0);
        const orderMonthlyRevenu = new Array(6).fill(0);
        lastSixMonthOrder.forEach((order) => {
            const creationDate = order.createdAt;
            const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
            if (monthDiff < 6) {
                orderMonthCount[6 - monthDiff - 1] += 1;
                orderMonthlyRevenu[6 - monthDiff - 1] += order.total;
            }
        });
        const categoryCount = await getInventory({
            categories,
            productCount,
        });
        const genderRatio = {
            male: userCount - femaleUsersCount,
            female: femaleUsersCount,
        };
        const modifiedLatestTransacton = latestTransaction.map((i) => ({
            _id: i._id,
            discount: i.discount,
            amount: i.total,
            quantity: i.orderItems.length,
            status: i.status,
        }));
        stats = {
            categoryCount,
            changePercent,
            count,
            chart: {
                order: orderMonthCount,
                revenu: orderMonthlyRevenu,
            },
            genderRatio,
            latestTransaction: modifiedLatestTransacton,
        };
        nodeCache.set(key, JSON.stringify({ stats }));
    }
    return res.status(200).json({
        success: true,
        stats,
    });
});
// & ======================Pie chart=============
export const getPieChart = TryCatch(async (req, res, next) => {
    let chart;
    const key = "admin-pie-chart";
    if (nodeCache.has(key)) {
        chart = JSON.parse(nodeCache.get(key));
    }
    else {
        const allOrderPromise = Order.find({}).select([
            "total",
            "discount",
            "subtotal",
            "tax",
            "shippingCharges",
        ]);
        const [processingOrder, shippedOrder, deliveredOrder, categories, productCount, outOfStock, allOrder, allUserDob, adminUser, customerUser,] = await Promise.all([
            Order.countDocuments({ status: "Processing" }),
            Order.countDocuments({ status: "Shipped" }),
            Order.countDocuments({ status: "Delivered" }),
            Product.distinct("category"),
            Product.countDocuments(),
            Product.countDocuments({ sock: 0 }),
            allOrderPromise,
            User.find({}).select(["dob"]),
            User.countDocuments({ role: "admin" }),
            User.countDocuments({ role: "user" }),
        ]);
        const orderFullFillment = {
            processing: processingOrder,
            shipped: shippedOrder,
            delivered: deliveredOrder,
        };
        const productCategories = await getInventory({
            categories,
            productCount,
        });
        const stockAvailability = {
            inStock: productCount - outOfStock,
            outOfStock,
        };
        const grossIncome = allOrder.reduce((prev, order) => prev + (order.total || 0), 0);
        const discount = allOrder.reduce((prev, order) => prev + (order.discount || 0), 0);
        const productionCost = allOrder.reduce((prev, order) => prev + (order.shippingCharges || 0), 0);
        const burnt = allOrder.reduce((prev, order) => prev + (order.tax || 0), 0);
        const marketingCost = Math.round(grossIncome * (30 / 100));
        const netMargin = grossIncome - discount - productionCost - burnt - marketingCost;
        const revenuDistribution = {
            netMargin,
            discount,
            productionCost,
            burnt,
            marketingCost,
        };
        const userAgeGroup = {
            teen: allUserDob.filter((i) => i.age < 20).length,
            adult: allUserDob.filter((i) => i.age >= 20 && i.age < 40).length,
            old: allUserDob.filter((i) => i.age >= 40).length,
        };
        const adminCustomer = {
            admin: adminUser,
            customer: customerUser,
        };
        chart = {
            orderFullFillment,
            productCategories,
            stockAvailability,
            revenuDistribution,
            adminCustomer,
            userAgeGroup,
        };
        nodeCache.set(key, JSON.stringify(chart));
    }
    return res.status(200).json({
        success: true,
        chart,
    });
});
// & =====================Bar chart =================
export const getBarChart = TryCatch(async (req, res, next) => {
    let chart;
    const key = "admin-bar-chart";
    if (nodeCache.has(key)) {
        chart = JSON.parse(nodeCache.get(key));
    }
    else {
        const today = new Date();
        const sixMonthAgo = new Date();
        sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);
        const twelveMonthAgo = new Date();
        twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);
        const lastSixMonthProductPromise = Product.find({
            createdAt: {
                $gte: sixMonthAgo,
                $lte: today,
            },
        });
        const lastSixMonthUserPromise = User.find({
            createdAt: {
                $gte: sixMonthAgo,
                $lte: today,
            },
        });
        const lastTwelveMonthOrderPromise = Order.find({
            createdAt: {
                $gte: twelveMonthAgo,
                $lte: today,
            },
        });
        const [product, user, order] = await Promise.all([
            lastSixMonthProductPromise,
            lastSixMonthUserPromise,
            lastTwelveMonthOrderPromise,
        ]);
        // Use the function:
        const productCount = getChartData({ length: 6, docArr: product, today });
        const userCount = getChartData({ length: 6, docArr: user, today });
        const orderCount = getChartData({ length: 12, docArr: order, today });
        chart = {
            product: productCount,
            user: userCount,
            order: orderCount,
        };
        nodeCache.set(key, JSON.stringify(chart));
    }
    return res.status(200).json({
        success: true,
        chart,
    });
});
export const getLineChart = TryCatch(async (req, res, next) => {
    let chart;
    const key = "admin-line-chart";
    if (nodeCache.has(key)) {
        chart = JSON.parse(nodeCache.get(key));
    }
    else {
        const today = new Date();
        const twelveMonthAgo = new Date();
        twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);
        const baseQuery = {
            createdAt: {
                $gte: twelveMonthAgo,
                $lte: today,
            },
        };
        const [product, user, order] = await Promise.all([
            Product.find(baseQuery).select("createdAt"),
            User.find(baseQuery).select("createdAt"),
            Order.find(baseQuery).select(["createdAt", "discount", "total"]),
        ]);
        // Use the function:
        const productCount = getChartData({ length: 12, docArr: product, today });
        const userCount = getChartData({ length: 12, docArr: user, today });
        const discount = getChartData({
            length: 12,
            docArr: order,
            today,
            property: "discount",
        });
        const revenue = getChartData({
            length: 12,
            docArr: order,
            today,
            property: "total",
        });
        chart = {
            product: productCount,
            user: userCount,
            discount,
            revenue,
        };
        nodeCache.set(key, JSON.stringify(chart));
    }
    return res.status(200).json({
        success: true,
        chart,
    });
});
