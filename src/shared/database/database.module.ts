import { DynamicModule, Module } from "@nestjs/common";
import { DataSource, DataSourceOptions } from "typeorm";

let instance: DataSource | null = null; // Singleton instance

@Module({})
export class DatabaseModule {
  static forRoot(config: DataSourceOptions): DynamicModule {
    const provider = {
      provide: "DATABASE_CONNECTION",
      useFactory: async () => {
        if (!instance) {
          try {
            const dataSource = new DataSource(config);
            await dataSource.initialize();
            console.log(`[DatabaseModule] Connected to ${config.type} database`);
            instance = dataSource;
          } catch (err) {
            console.error("[DatabaseModule] Failed to connect to DB", err);
            throw err;
          }
        }
        return instance;
      },
    };

    return {
      module: DatabaseModule,
      providers: [provider],
      exports: [provider],
    };
  }
}
