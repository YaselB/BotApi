import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfiguracionMensaje } from './configracion-mensaje.entity';
import { Repository } from 'typeorm';
import { User } from 'src/User/user.entity';
import { MessageBack } from './MessageBack';
import { CreateConfigurationMessage } from './Message_configuration.dto';
import { MessageBackToUpdate } from './MessageBackToUpdate.dto';


@Injectable()
export class ConfiguracioMensajeService {
    constructor(
        @InjectRepository(ConfiguracionMensaje)
        private configurationRepository: Repository<ConfiguracionMensaje>,
        @InjectRepository(User)
        private user: Repository<User>
    ){}
    async createConfigurationMessage(configurationMessage: CreateConfigurationMessage): Promise<ConfiguracionMensaje>{
        const {chat_id , ids_destino , mensaje , intervalo } = configurationMessage;
        const user =  await this.user.findOne({ where: { idUserTelegram: chat_id}})
        if(!user){
            throw new NotFoundException('Usuario no encontrado');
        }
        const configuration = this.configurationRepository.create({
            user,
            ids_destino,
            mensaje,
            intervalo,
        })
        console.log(new Date());
        console.log(configuration.createdAt);
        return await this.configurationRepository.save(configuration);
    }
    async findAllUser(): Promise<ConfiguracionMensaje[]>{
        return await this.configurationRepository.find({relations: ['user']});
    }
    async findByUser(idUserTelegram: number): Promise<ConfiguracionMensaje[]> {
        return await this.configurationRepository.find({
          where: { user: { idUserTelegram: idUserTelegram } }, // Ajusta 'idTelegram' si es diferente
          relations: ['user'],
        });
    }
    async OrderByTime(): Promise<MessageBack[]> {
        var messages = await this.findAllUser();
        var messagesToGetBack: MessageBack[] = [];
        var timeNow: Date = new Date();
        var timeNowUtc = timeNow.toISOString(); 
        for(const element of messages){
            var createdAtUtc = new Date(element.createdAt.toISOString());
            var createAtTime = new Date(createdAtUtc).getTime();
            var nowTime = new Date(timeNowUtc).getTime();
            const diffMs = nowTime - createAtTime;
            const diffMinutes = diffMs / (1000 * 60);
    
            if (diffMinutes >= element.intervalo) {
                
                const messageBack: MessageBack = {
                    ids_destino: element.ids_destino,
                    mensaje: element.mensaje,
                    idUserTelegram: element.user.idUserTelegram,
                    sessionToken: element.user.sesionToken
                };
                messagesToGetBack.push(messageBack);
                element.createdAt = new Date();
                await this.configurationRepository.save(element);
            }
        }
        return messagesToGetBack;
    }
    async UserConfiguration(idUserTelegram : number) : Promise<MessageBackToUpdate[]>{
        var messages = await this.findByUser(idUserTelegram);
        var messagesBack : MessageBackToUpdate [] = [];
        for(const element of messages){
            const messageBack: MessageBackToUpdate = {
                ids_destino: element.ids_destino,
                idUserTelegram: element.user.idUserTelegram,
                mensaje: element.mensaje,
                sessionToken: element.user.sesionToken,
                idConfig: element.id,
                interval: element.intervalo
            };
            messagesBack.push(messageBack);
        }
        return messagesBack;
    }
    async Update(configs: MessageBackToUpdate[] , idUserTelegram: number){
        var messages = await this.findByUser(idUserTelegram);
        for(const i of messages){
            var entityToUpdate = configs.find(
                item => item.idConfig == i.id
            );
            if(entityToUpdate){
                i.ids_destino = entityToUpdate.ids_destino;
                i.intervalo = entityToUpdate.interval;
                i.mensaje = entityToUpdate.mensaje;
            }
        }
        await this.configurationRepository.save(messages);
    }
}
