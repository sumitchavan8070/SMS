import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req } from "@nestjs/common"
import { TimetableService } from "./timetable.service"
import { CreateTimetableDto } from "./dto/create-timetable.dto"
import { UpdateTimetableDto } from "./dto/update-timetable.dto"

@Controller("v1/timetable")
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  /**
   * Get all timetable entries
   */
  @Get()
  async getAllTimetables(@Req() req : Request) {

    const user = req['user']; 
    const schoolId = user.school_id; 
    return this.timetableService.getAllTimetables(schoolId); 
  }

  /**
   * Get a timetable entry by ID
   */
  @Get(":id")
  async getTimetableById(@Param("id") id: number) {
    return this.timetableService.getTimetableById(id)
  }

  /**
   * Get timetable for a specific class
   */
  @Get("class/:classId")
  async getClassTimetable(@Param("classId") classId: number) {
    return this.timetableService.getClassTimetable(classId)
  }

  /**
   * Create a new timetable entry
   */
  @Post()
  async createTimetableEntry(@Body() createTimetableDto: CreateTimetableDto) {
    return this.timetableService.createTimetableEntry(createTimetableDto)
  }

  /**
   * Update a timetable entry
   */
  @Put(":id")
  async updateTimetableEntry(
    @Param("id") id: number,
    @Body() updateTimetableDto: UpdateTimetableDto,
  ) {
    return this.timetableService.updateTimetableEntry(id, updateTimetableDto)
  }

  /**
   * Delete a timetable entry
   */
  @Delete(":id")
  async deleteTimetableEntry(@Param("id") id: number) {
    return this.timetableService.deleteTimetableEntry(id)
  }
}
