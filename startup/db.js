const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
  const db= config.get('db');
  mongoose.connect(db,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }).then(() => 
      winston.info(`Connected to ${db}...`));


      // skip(), limilt(), sort()三个放在一起执行的时候，执行的顺序是先 sort(), 然后是 skip()，最后是显示的 limit()。
// }
// 1、查看集合索引

// db.col.getIndexes()

// 2、查看集合索引大小

// db.col.totalIndexSize()

// 3、删除集合所有索引

// db.col.dropIndexes()

// 4、删除集合指定索引

// db.col.dropIndex("索引名称")


// 利用 TTL 集合对存储的数据进行失效时间设置：经过指定的时间段后或在指定的时间点过期，MongoDB 独立线程去清除数据。类似于设置定时自动删除任务，可以清除历史记录或日志等前提条件，设置 Index 的关键字段为日期类型 new Date()。

// 例如数据记录中 createDate 为日期类型时：

//     设置时间180秒后自动清除。
//     设置在创建记录后，180 秒左右删除。

// db.col.createIndex({"createDate": 1},{expireAfterSeconds: 180})

// 由记录中设定日期点清除。

// 设置 A 记录在 2019 年 1 月 22 日晚上 11 点左右删除，A 记录中需添加 "ClearUpDate": new Date('Jan 22, 2019 23:00:00')，且 Index中expireAfterSeconds 设值为 0。

// db.col.createIndex({"ClearUpDate": 1},{expireAfterSeconds: 0})

// 其他注意事项:

//     索引关键字段必须是 Date 类型。
//     非立即执行：扫描 Document 过期数据并删除是独立线程执行，默认 60s 扫描一次，删除也不一定是立即删除成功。
//     单字段索引，混合索引不支持。