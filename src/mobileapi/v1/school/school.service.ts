import { Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { School } from "./entities/school.entity"
import { CreateSchoolDto } from "./dto/create-school.dto"
import { UpdateSchoolDto } from "./dto/update-school.dto"

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
  ) {}

  async findAll() {
    try {
      const schools = await this.schoolRepository.find({
        order: { name: "ASC" },
      })

      return {
        status: 1,
        message: "Schools retrieved successfully",
        data: schools,
      }
    } catch (error) {
      console.error("Error fetching schools:", error)
      throw new InternalServerErrorException("Failed to fetch schools")
    }
  }

  async findById(id: number) {
    try {
      const school = await this.schoolRepository.findOne({ where: { id } })

      if (!school) {
        throw new NotFoundException("School not found")
      }

      return {
        status: 1,
        message: "School retrieved successfully",
        data: school,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      console.error("Error fetching school:", error)
      throw new InternalServerErrorException("Failed to fetch school")
    }
  }

  async create(createSchoolDto: CreateSchoolDto) {
    try {
      const school = this.schoolRepository.create(createSchoolDto)
      const savedSchool = await this.schoolRepository.save(school)

      return {
        status: 1,
        message: "School created successfully",
        data: savedSchool,
      }
    } catch (error) {
      console.error("Error creating school:", error)
      throw new InternalServerErrorException("Failed to create school")
    }
  }

  async update(id: number, updateSchoolDto: UpdateSchoolDto) {
    try {
      const school = await this.schoolRepository.findOne({ where: { id } })
      if (!school) {
        throw new NotFoundException("School not found")
      }

      Object.assign(school, updateSchoolDto)
      const updatedSchool = await this.schoolRepository.save(school)

      return {
        status: 1,
        message: "School updated successfully",
        data: updatedSchool,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      console.error("Error updating school:", error)
      throw new InternalServerErrorException("Failed to update school")
    }
  }

  async delete(id: number) {
    try {
      const school = await this.schoolRepository.findOne({ where: { id } })
      if (!school) {
        throw new NotFoundException("School not found")
      }

      school.status = "inactive" as any
      await this.schoolRepository.save(school)

      return {
        status: 1,
        message: "School deleted successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      console.error("Error deleting school:", error)
      throw new InternalServerErrorException("Failed to delete school")
    }
  }
}
