const ProjectSchema = {
    name: 'Project',
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
        time: 'string',
        created: 'date',
        updated: 'date',
    }
};
const TaskSchema = {
    name: 'Task',
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
        time: 'string',
        memo: 'string',
        created: 'date',
        updated: 'date',
    }
}

export const realmOptions = {
    schemaVersion: 0,
    schema: [ProjectSchema, TaskSchema],
    // migration: (oldRealm, newRealm) => {
    //     // only apply this change if upgrading to schemaVersion 1
    // }
}
