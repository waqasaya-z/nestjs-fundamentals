import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameNameToTitle1748698156456 implements MigrationInterface {
    name = 'RenameNameToTitle1748698156456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" RENAME COLUMN "name" TO "title"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" RENAME COLUMN "title" TO "name"`);
    }

}
