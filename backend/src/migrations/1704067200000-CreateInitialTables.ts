import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateInitialTables1704067200000 implements MigrationInterface {
    name = 'CreateInitialTables1704067200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create stocks table
        await queryRunner.createTable(new Table({
            name: "stocks",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "symbol",
                    type: "varchar",
                    length: "10",
                    isUnique: true
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255"
                },
                {
                    name: "status",
                    type: "enum",
                    enum: ["restricted", "suspended", "normal"],
                    default: "'normal'"
                },
                {
                    name: "exchange",
                    type: "enum",
                    enum: ["HNX", "HOSE", "UPCOM"],
                    default: "'HNX'"
                },
                {
                    name: "currentPrice",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                    isNullable: true
                },
                {
                    name: "priceChange",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                    isNullable: true
                },
                {
                    name: "priceChangePercent",
                    type: "decimal",
                    precision: 5,
                    scale: 2,
                    isNullable: true
                },
                {
                    name: "volume",
                    type: "bigint",
                    isNullable: true
                },
                {
                    name: "marketCap",
                    type: "bigint",
                    isNullable: true
                },
                {
                    name: "restrictionReason",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "restrictionDate",
                    type: "timestamp",
                    isNullable: true
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "lastUpdated",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                }
            ],
            indices: [
                {
                    name: "IDX_stocks_symbol",
                    columnNames: ["symbol"]
                },
                {
                    name: "IDX_stocks_status",
                    columnNames: ["status"]
                },
                {
                    name: "IDX_stocks_lastUpdated",
                    columnNames: ["lastUpdated"]
                }
            ]
        }), true);

        // Create watchlist_items table
        await queryRunner.createTable(new Table({
            name: "watchlist_items",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "userId",
                    type: "varchar",
                    length: "100",
                    isNullable: true
                },
                {
                    name: "stockSymbol",
                    type: "varchar",
                    length: "10"
                },
                {
                    name: "notes",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "addedDate",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "isActive",
                    type: "boolean",
                    default: true
                }
            ],
            indices: [
                {
                    name: "IDX_watchlist_items_stockSymbol",
                    columnNames: ["stockSymbol"]
                }
            ]
        }), true);

        // Create financial_reports table
        await queryRunner.createTable(new Table({
            name: "financial_reports",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "stockSymbol",
                    type: "varchar",
                    length: "10"
                },
                {
                    name: "reportType",
                    type: "enum",
                    enum: ["quarterly", "annual", "extraordinary"]
                },
                {
                    name: "year",
                    type: "int"
                },
                {
                    name: "quarter",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "revenue",
                    type: "bigint",
                    isNullable: true
                },
                {
                    name: "profit",
                    type: "bigint",
                    isNullable: true
                },
                {
                    name: "eps",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                    isNullable: true
                },
                {
                    name: "reportUrl",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "publishDate",
                    type: "timestamp"
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                }
            ],
            indices: [
                {
                    name: "IDX_financial_reports_stockSymbol",
                    columnNames: ["stockSymbol"]
                },
                {
                    name: "IDX_financial_reports_year",
                    columnNames: ["year"]
                },
                {
                    name: "IDX_financial_reports_publishDate",
                    columnNames: ["publishDate"]
                }
            ]
        }), true);

        // Create board_resolutions table
        await queryRunner.createTable(new Table({
            name: "board_resolutions",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "stockSymbol",
                    type: "varchar",
                    length: "10"
                },
                {
                    name: "title",
                    type: "varchar",
                    length: "500"
                },
                {
                    name: "resolutionDate",
                    type: "timestamp"
                },
                {
                    name: "content",
                    type: "text"
                },
                {
                    name: "documentUrl",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "source",
                    type: "varchar",
                    length: "100"
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                }
            ],
            indices: [
                {
                    name: "IDX_board_resolutions_stockSymbol",
                    columnNames: ["stockSymbol"]
                },
                {
                    name: "IDX_board_resolutions_resolutionDate",
                    columnNames: ["resolutionDate"]
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("board_resolutions");
        await queryRunner.dropTable("financial_reports");
        await queryRunner.dropTable("watchlist_items");
        await queryRunner.dropTable("stocks");
    }
}