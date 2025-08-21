import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import { Repository } from "typeorm"
import { Timetable } from "../entities/timetable.entity"
import { Classes } from "../entities/classes.entity"
import { Subjects } from "../entities/subjects.entity"
import { Users } from "../entities/users.entity"
import { CreateTimetableDto } from "./dto/create-timetable.dto"
import { UpdateTimetableDto } from "./dto/update-timetable.dto"
import { InjectRepository } from "@nestjs/typeorm"

@Injectable()
export class TimetableService {
  constructor(
    @InjectRepository(Timetable)
    private timetableRepository: Repository<Timetable>,

    @InjectRepository(Classes)
    private classRepository: Repository<Classes>,

    @InjectRepository(Subjects)
    private subjectRepository: Repository<Subjects>,

    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) { }

  /**
   * Get all timetable entries with class, subject & teacher
   */
  async getAllTimetables(schoolId) {
    try {
      const timetables = await this.timetableRepository.find({
        relations: ["class", "subject", "school"],
        order: { startTime: "ASC" },
        where: { schoolId }
      });

      return {
        status: 1,
        message: "All timetable entries retrieved successfully",
        data: timetables.map((t) => ({
          id: t.id,
          className: t.class?.name || null,
          classID: t.classId,
          schoolId: t.schoolId,
          subjectId: t.subject.id,
          subjectname: t.subject.name,
          startTime: t.startTime,
          endTime: t.endTime,
        })),
      };
    } catch (error) {
      return {
        status: 0,
        message: "Failed to retrieve timetables",
        error: error.message,
      };
    }
  }



  /**
   * Get timetable entry by ID
   */
  async getTimetableById(id: number) {
    const entry = await this.timetableRepository.findOne({
      where: { id },
      relations: ["class", "subject"],
    })

    if (!entry) throw new NotFoundException("Timetable entry not found")

    return {
      status: 1,
      message: "Timetable entry retrieved successfully",
      data: {
        id: entry.id,
        className: entry.class?.name,
        subjectName: entry.subject?.name,
        teacherId: entry.id,
        startTime: entry.startTime,
        endTime: entry.endTime,
      },
    }
  }

  /**
   * Create new timetable entry
   */
  async createTimetableEntry(createDto: CreateTimetableDto) {
    const { classId, subjectId, teacherId, schoolId, startTime, endTime, room } = createDto

    const classEntity = await this.classRepository.findOne({ where: { id: classId } })
    if (!classEntity) throw new NotFoundException("Class not found")

    const subject = await this.subjectRepository.findOne({ where: { id: subjectId } })
    if (!subject) throw new NotFoundException("Subject not found")

    const teacher = await this.userRepository.findOne({ where: { id: teacherId } })
    if (!teacher) throw new NotFoundException("Teacher not found")

    // Conflict check → class OR teacher at same time/day
    const conflict = await this.timetableRepository.findOne({
      where: [
        { classId, startTime },
        { startTime },
      ],
    })
    if (conflict) throw new ConflictException("Conflicting timetable entry exists")

    const newEntry = this.timetableRepository.create({
      classId,
      subjectId,
      schoolId,
      startTime,
      endTime,
    })

    await this.timetableRepository.save(newEntry)

    return {
      status: 1,
      message: "Timetable entry created successfully",
      data: newEntry,
    }
  }

  /**
   * Update timetable entry
   */
  async updateTimetableEntry(id: number, updateDto: UpdateTimetableDto) {
    const entry = await this.timetableRepository.findOne({ where: { id } })
    if (!entry) throw new NotFoundException("Timetable entry not found")

    Object.assign(entry, updateDto)
    await this.timetableRepository.save(entry)

    return {
      status: 1,
      message: "Timetable entry updated successfully",
      data: entry,
    }
  }

  /**
   * Delete timetable entry
   */
  async deleteTimetableEntry(id: number) {
    const entry = await this.timetableRepository.findOne({ where: { id } })
    if (!entry) throw new NotFoundException("Timetable entry not found")

    await this.timetableRepository.delete(id)

    return {
      status: 1,
      message: "Timetable entry deleted successfully",
    }
  }

  /**
   * Get timetable for a class
   */
  async getClassTimetable(classId: number) {
    const classEntity = await this.classRepository.findOne({ where: { id: classId } })
    if (!classEntity) throw new NotFoundException("Class not found")

    const timetable = await this.timetableRepository.find({
      where: { classId },
      relations: ["subject"],
      order: { startTime: "ASC" },
    })

    return {
      status: 1,
      message: "Class timetable retrieved successfully",
      data: {
        class: { id: classEntity.id, name: classEntity.name },
        timetable: timetable.map((t) => ({
          id: t.id,
          subjectName: t.subject?.name,
          teacherId: t.id,
          startTime: t.startTime,
          endTime: t.endTime,
        })),
      },
    }
  }
}
