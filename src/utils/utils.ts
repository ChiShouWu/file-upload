/**
 * create sql url from config, and set environment variable group to 'DATABASE' thus will get url depend on any database (e,g: mongodb, mysql)
 * @param configGroupName config group name where setting of database is stored, default is `DATABASE`
 * @returns
 */
export const genDbUrl = (dbSetting: {
  protocol: string;
  host: string;
  database: string;
  port?: number;
  username?: string;
  password?: string;
  params?: string;
}): string => {
  const {
    protocol,
    host,
    database,
    port,
    username,
    password,
    params: params,
  } = dbSetting;
  const url = `${protocol}://${
    username && password ? `${username}:${password}@` : ''
  }${host}${port ? `:${port}` : ''}/${database}${params ? `?${params}` : ''}`;
  return url;
};

export function getFileExtension(filename: string): string {
  return filename.split('.').pop();
}
