import { describe, expect, it } from 'vitest'
import { CreateAppointment } from './create-appointment'
import { Appointment } from '../entities/appointment'
import { InMemoryAppointmentsRepository } from '../repositories/in-memory/in-memory-appointments-repository'
import { getFutureDate } from '../util/get-future-date'

describe('Create Appointment', () => {
  it('should be able to create an appointment', () => {
    const appointmentsRepository = new InMemoryAppointmentsRepository()
    const createAppointment = new CreateAppointment(appointmentsRepository)
    const startsAt = getFutureDate('2023-01-01')
    const endsAt = getFutureDate('2023-01-02')

    expect(
      createAppointment.execute({
        customer: 'John Doe',
        startsAt,
        endsAt,
      }),
    ).resolves.toBeInstanceOf(Appointment)
  })

  it('should not be able to create an appointment with ovellaping dates', async () => {
    const startsAt = getFutureDate('2023-01-10')
    const endsAt = getFutureDate('2023-01-15')

    const appointmentsRepository = new InMemoryAppointmentsRepository()
    const createAppointment = new CreateAppointment(appointmentsRepository)

    await createAppointment.execute({
      customer: 'John Doe',
      startsAt,
      endsAt,
    })

    expect(
      createAppointment.execute({
        customer: 'John Doe',
        startsAt: getFutureDate('2023-01-14'),
        endsAt: getFutureDate('2023-01-18'),
      }),
    ).rejects.toBeInstanceOf(Error)

    expect(
      createAppointment.execute({
        customer: 'John Doe',
        startsAt: getFutureDate('2023-01-08'),
        endsAt: getFutureDate('2023-01-12'),
      }),
    ).rejects.toBeInstanceOf(Error)

    expect(
      createAppointment.execute({
        customer: 'John Doe',
        startsAt: getFutureDate('2023-01-08'),
        endsAt: getFutureDate('2023-01-17'),
      }),
    ).rejects.toBeInstanceOf(Error)

    expect(
      createAppointment.execute({
        customer: 'John Doe',
        startsAt: getFutureDate('2023-01-11'),
        endsAt: getFutureDate('2023-01-12'),
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
