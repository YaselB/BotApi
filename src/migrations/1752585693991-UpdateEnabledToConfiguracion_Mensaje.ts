import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEnabledToConfiguracionMensaje1752585693991 implements MigrationInterface {
    name = 'UpdateEnabledToConfiguracionMensaje1752585693991'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "configuracion_mensaje" ADD "enabled" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "configuracion_mensaje" DROP CONSTRAINT "FK_6fabe174de0c1710ffef791abb0"`);
        await queryRunner.query(`ALTER TABLE "configuracion_mensaje" DROP CONSTRAINT "PK_618fd9a26e7461e5736be2ee9aa"`);
        await queryRunner.query(`ALTER TABLE "configuracion_mensaje" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "configuracion_mensaje" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "configuracion_mensaje" ADD CONSTRAINT "PK_618fd9a26e7461e5736be2ee9aa" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "configuracion_mensaje" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "configuracion_mensaje" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "configuracion_mensaje" ADD CONSTRAINT "FK_6fabe174de0c1710ffef791abb0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "configuracion_mensaje" DROP CONSTRAINT "FK_6fabe174de0c1710ffef791abb0"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "configuracion_mensaje" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "configuracion_mensaje" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "configuracion_mensaje" DROP CONSTRAINT "PK_618fd9a26e7461e5736be2ee9aa"`);
        await queryRunner.query(`ALTER TABLE "configuracion_mensaje" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "configuracion_mensaje" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "configuracion_mensaje" ADD CONSTRAINT "PK_618fd9a26e7461e5736be2ee9aa" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "configuracion_mensaje" ADD CONSTRAINT "FK_6fabe174de0c1710ffef791abb0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "configuracion_mensaje" DROP COLUMN "enabled"`);
    }

}
