import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common"

@Injectable()
export class ParseNumbersArrayPipe implements PipeTransform<string, number[] | undefined> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.data === undefined) return undefined

    const errorResponse = {
      query: {
        [metadata.data]: "An array of numbers expected.",
      },
    }

    if (value === undefined) return undefined
    if (typeof value !== "string") {
      throw new BadRequestException(errorResponse)
    }

    const numbers = value.split(",").map(Number)
    if (numbers.some((number) => isNaN(number))) {
      throw new BadRequestException(errorResponse)
    }

    return numbers
  }
}
