import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { ConfiguracioMensajeService } from './configuracio-mensaje.service';
import { CreateConfigurationMessage } from './Message_configuration.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { MessageBack } from './MessageBack';
import { MessageBackToUpdate } from './MessageBackToUpdate.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@ApiTags('configuracio-mensaje')
@Controller('configuracio-mensaje')
export class ConfiguracioMensajeController {
    constructor(private configurationMessageService : ConfiguracioMensajeService){

  }
    @UseGuards(JwtAuthGuard)
    @Post()
    async createConfigurationMessage(@Body() messageConfiguration: CreateConfigurationMessage , @Res() res : Response){
        const configurationMessage = await this.configurationMessageService.createConfigurationMessage(messageConfiguration);
        if(!configurationMessage){
            return res.status(HttpStatus.BAD_REQUEST).json({
                message : 'No se pudo crear la configuracion del mensaje'
            });
        }
        return res.status(HttpStatus.OK).json({
            message: "Configuracion creada correctamente"
        })
    }
    @Get()
    async GetAllConfiguration():Promise<MessageBack[]>{
        return await this.configurationMessageService.OrderByTime();
    }
    @UseGuards(JwtAuthGuard)
    @Get("GetconfigurationforUser/:id")
    async GetAllConfigurationforUser(@Param('id' , ParseIntPipe)idUserTelegram: number): Promise<MessageBackToUpdate[]>{
        return await this.configurationMessageService.UserConfiguration(idUserTelegram);
    }
    @UseGuards(JwtAuthGuard)
    @Patch(":id")
    async UpdateConfig(@Body() messages: MessageBackToUpdate[] , @Param('id' , ParseIntPipe) idUserTelegram: number , @Res() response: Response){
        await this.configurationMessageService.Update(messages , idUserTelegram);
        return response.status(HttpStatus.OK).json({
            message: "Configuraciones actualizadas con exito"
        });
    }
    @UseGuards(JwtAuthGuard)
    @Delete("DeleteOneConfiguration/:id")
    async DeleteOne( @Param('id') id: string , @Res() response: Response){
        try{
            await this.configurationMessageService.DeleteOne(id);
            return response.status(200).json({
                message: "Configuración eliminada correctamente"
            });
        }catch(error){
            return response.status(404).json({
                message : "La configuracion no ha sido encontrada" 
            });
        }
    }
    @UseGuards(JwtAuthGuard)
    @Delete("DeleteAllConfigurations/:id")
    async DeleteAll( @Param('id' , ParseIntPipe) id: number , @Res() response : Response){
        await this.configurationMessageService.DeleteAll(id);
        return response.status(200).json({
            message: "Configuraciones eliminadas correctamente"
        });
    } 
}
