// 列name 中包含参数name，不区分大小写
    // // 查询 title 包含"教"字的文档 db.col.find({title:/教/}) db.col.find({title:/^教/})
    // and db.col.find({key1:value1, key2:value2}).pretty()
    // db.col.find({likes : {$lt :200, $gt : 100}})
    // or db.col.find({$or:[{"by":"mike"},{"title": "MongoDB tutorial"}]}).pretty()
    // and or 联合使用
    // db.col.find({"likes": {$gt:50}, $or: [{"by": "mike"},{"title": "MongoDB tutorial"}]}).pretty()