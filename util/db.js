// db
import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabase('db')

export const createTables = () => {
    const create_projects = ' \
    CREATE TABLE IF NOT EXISTS projects ( \
      id integer primary key autoincrement not null , \
      name text,\
      time text\
    ); \
  ';

    const create_tasks = ' \
    CREATE TABLE IF NOT EXISTS tasks ( \
      id integer primary key autoincrement not null , \
      name text,\
      project_id integer\
    ); \
  ';

    const create_times = ' \
    CREATE TABLE IF NOT EXISTS times ( \
      id integer primary key autoincrement not null , \
      date text,\
      time text,\
      task_id integer,\
      project_id integer\
    ); \
  ';


    execSql(create_projects);
    execSql(create_tasks);
    execSql(create_times);

}

export const execSql = (sql, params = null) => {
    // dbファイルの場所確認
    // console.log("FileSystem; " + FileSystem.documentDirectory);
    db.transaction(tx => {
        tx.executeSql(
            sql,
            params,
            (res) => { console.log('execute success') },
            (object, error) => { console.log('execute fail', error) }
        );
    },
    )
}


