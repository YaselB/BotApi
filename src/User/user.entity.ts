import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ConfiguracionMensaje } from 'src/configuracion-mensaje/configracion-mensaje.entity';


@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({type: 'bigint', unique: true})
    idUserTelegram: number;
    @Column({type: 'varchar', unique: false})
    sesionToken: string;
    @OneToMany(() => ConfiguracionMensaje , configuracion => configuracion.user)
    configuracion: ConfiguracionMensaje[];

}