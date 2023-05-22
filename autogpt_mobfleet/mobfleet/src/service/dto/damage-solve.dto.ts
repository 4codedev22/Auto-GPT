/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
/**
 * A DamageSolveDTO object.
 */
export class DamageSolveDTO {
    @ApiModelProperty({ description: 'solution_images field', required: false })
    solutionComment: string;

    @IsOptional()
    solutionImages:string[];
}
