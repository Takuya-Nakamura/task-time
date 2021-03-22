// db
import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabase('db')
import * as FileSystem from 'expo-file-system'



export const createTables = () => {
  create()

}

const create = () => {
  const create_projects = ' \
  CREATE TABLE IF NOT EXISTS projects ( \
    id integer primary key autoincrement not null , \
    name text,\
    time text,\
    color text,\
    deleted integer default 0, \
    sort_order integer default 0 \
    ); \
  ';

  const create_tasks = ' \
  CREATE TABLE IF NOT EXISTS tasks ( \
    id integer primary key autoincrement not null , \
    name text,\
    project_id integer, \
    deleted integer  default 0, \
    sort_order integer default 0 \
  ); \
  '

  const create_times = ' \
  CREATE TABLE IF NOT EXISTS times ( \
    id integer primary key autoincrement not null , \
    date text,\
    time text,\
    memo text,\
    task_id integer,\
    project_id integer, \
    deleted integer default 0, \
    sort_order integer default 0 \
  ); \
  '


  execSql(create_projects)
  execSql(create_tasks)
  execSql(create_times)
}


const reset = () => {
  const dropProject = 'DROP TABLE projects;'
  const dropTasks = 'DROP TABLE tasks;'
  const dropTimes = 'DROP TABLE times;'

  execSql(dropProject)
  execSql(dropTasks)
  execSql(dropTimes)
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


