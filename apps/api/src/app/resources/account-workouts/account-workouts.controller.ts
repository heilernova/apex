import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AccountWorkoutsService } from './account-workouts.service';
import { CurrentSession, Session } from '../../auth';
import { CreateWorkoutDto } from './dto/create-workout.dto';

@Controller('account/workouts')
export class AccountWorkoutsController {
  constructor(
    private readonly accountWorkoutsService: AccountWorkoutsService
  ) {}


  @Get()
  getAll(@CurrentSession() session: Session) {
    return this.accountWorkoutsService.getAll(session);
  }

  @Get(':id')
  get(@Param('id') id: string, @CurrentSession() session: Session) {
    return this.accountWorkoutsService.get(id, session);
  }

  @Post()
  create(@Body() createWorkoutDto: CreateWorkoutDto, @CurrentSession() session: Session) {
    return this.accountWorkoutsService.create(createWorkoutDto, session);
  }

  @Post()
  publishWorkout(@Param('id') id: string, @CurrentSession() session: Session) {
    return this.accountWorkoutsService.publish(id, session);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkoutDto: CreateWorkoutDto,
    @CurrentSession() session: Session,
  ) {
    return this.accountWorkoutsService.update(id, updateWorkoutDto, session);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentSession() session: Session) {
    return this.accountWorkoutsService.remove(id, session); 
  }
}
