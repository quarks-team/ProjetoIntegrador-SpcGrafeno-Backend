import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';

describe('setupTest', () => {
  let client: Client;

  beforeAll(async () => {
    const container = await new PostgreSqlContainer().start();

    client = new Client({
      host: container.getHost(),
      user: container.getUsername(),
      password: container.getPassword(),
      database: container.getDatabase(),
      port: container.getPort(),
    });

    await client.connect();
  }, 100000);

  afterAll(async () => {
    await client.end();
  });

  it('should test db connection!', async () => {
    const teste = (await client.query('SELECT NOW()')).rows[0].now;
    expect(new Date(teste).getUTCDate()).toBe(new Date().getUTCDate());
  });
});
