import { getColl } from "./connectDB.js";

export async function showSchema() {
    const coll = getColl();

    const pipeline = [
        {
            $project: {
                fields: {
                    $objectToArray: "$$ROOT",
                },
            },
        },
        {
            $unwind: "$fields",
        },
        {
            $project: {
                fieldName: "$fields.k",
                dataType: {
                    $switch: {
                        branches: [
                            { case: { $eq: [{ $type: "$fields.v" }, "string"] }, then: "String" },
                            { case: { $eq: [{ $type: "$fields.v" }, "double"] }, then: "Double" },
                            { case: { $eq: [{ $type: "$fields.v" }, "int"] }, then: "Int" },
                            { case: { $eq: [{ $type: "$fields.v" }, "bool"] }, then: "Boolean" },
                            { case: { $eq: [{ $type: "$fields.v" }, "array"] }, then: "Array" },
                            { case: { $eq: [{ $type: "$fields.v" }, "object"] }, then: "Object" },
                            { case: { $eq: [{ $type: "$fields.v" }, "date"] }, then: "Date" },
                            { case: { $eq: [{ $type: "$fields.v" }, "null"] }, then: "Null" },
                            { case: { $eq: [{ $type: "$fields.v" }, "undefined"] }, then: "Undefined" },
                            { case: { $eq: [{ $type: "$fields.v" }, "binData"] }, then: "Binary Data" },
                            { case: { $eq: [{ $type: "$fields.v" }, "objectId"] }, then: "ObjectID" },
                            { case: { $eq: [{ $type: "$fields.v" }, "regex"] }, then: "Regular Expression" },
                            { case: { $eq: [{ $type: "$fields.v" }, "javascript"] }, then: "JavaScript" },
                            { case: { $eq: [{ $type: "$fields.v" }, "symbol"] }, then: "Symbol" },
                            { case: { $eq: [{ $type: "$fields.v" }, "javascriptWithScope"] }, then: "JavaScript with Scope" },
                            { case: { $eq: [{ $type: "$fields.v" }, "int32"] }, then: "32-bit Integer" },
                            { case: { $eq: [{ $type: "$fields.v" }, "timestamp"] }, then: "Timestamp" },
                            { case: { $eq: [{ $type: "$fields.v" }, "int64"] }, then: "64-bit Integer" },
                            { case: { $eq: [{ $type: "$fields.v" }, "decimal"] }, then: "Decimal" },
                            { case: { $eq: [{ $type: "$fields.v" }, "minKey"] }, then: "Min Key" },
                            { case: { $eq: [{ $type: "$fields.v" }, "maxKey"] }, then: "Max Key" },
                        ],
                        default: "Unknown",
                    },
                },
            },
        },
        {
            $group: {
                _id: "$fieldName",
                dataType: { $first: "$dataType" },
                count: { $sum: 1 },
            },
        },
    ];

    const aggCursor = coll.aggregate(pipeline);

    for await (const doc of aggCursor) {
        console.log(doc);
    }
}
