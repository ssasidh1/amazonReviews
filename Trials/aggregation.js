import { getColl } from "./connectDB.js";



export async function AggBestSellingCategories(){
    
    const coll = getColl();
    const pipeline = [
        {
            $match: {
                $and: [
                    { "brand": { $in: ["Amazon", "Amazonbasics"] } },
                    { "reviews.rating": { $gt: 4 } }
                ]
            }
        },
        {
            $group: {
                _id: { brand: "$brand", primaryCategories: "$primaryCategories" },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                brand: "$_id.brand",
                primaryCategories: "$_id.primaryCategories",
                count: 1
            }
        },
        {
            $sort: { count: -1 }
        }
    ];
    
    const aggCursor = coll.aggregate(pipeline)

    for await (const doc of aggCursor){
        console.log(doc);
    }
}

export async function AggBestSellCategoriesByYear() {
    const coll = getColl();
    const pipeline = [
        {
            $addFields: {
                parsedDate: {
                    $dateFromString: {
                        dateString: "$reviews.date"
                    }
                }
            }
        },
        {
            $addFields: {
                year: { $year: "$parsedDate" },
                date: { $dateToString: { format: "%Y-%m-%d", date: "$parsedDate" } }
            }
        },
        {
            $match: {
                "brand": { $in: ["Amazon", "Amazonbasics"] },
                "reviews.rating": { $gt: 4 }
            }
        },
        {
            $group: {
                _id: {
                    brand: "$brand",
                    year: "$year",
                    primaryCategories: "$primaryCategories"
                },
                avgRating: { $avg: "$reviews.rating" },
                count: { $sum: 1 }
            }
        },
      
        {
            $project: {
                _id: 0,
                brand: "$_id.brand",
                primaryCategories: "$_id.primaryCategories",
                year: "$_id.year",
                count: 1
            }
        },
        {
            $sort: { count: -1 }
        }

    ];

    const aggCursor = coll.aggregate(pipeline);

    for await (const doc of aggCursor) {
        console.log(doc);
    }
}
