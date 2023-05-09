import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from '@material-tailwind/react'
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { StatisticsCard } from '@/widgets/cards'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import Moment from 'moment'
import { DatePicker, Button, InputNumber } from 'antd'
import dayjs from 'dayjs'
import { CalendarIcon } from '@heroicons/react/24/solid'
import { useRef } from 'react'
import toast from 'react-hot-toast'
import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

const getMonthsFromRooms = (rooms) => {
  let _rooms = rooms
  let arr = []
  if (!rooms) return arr
  if (rooms.length <= 0) return arr
  if (!Array.isArray(_rooms)) _rooms = [_rooms]
  _rooms.map((room) =>
    room.meterReadings.map((reading) => {
      let found = false
      arr.find((value) => {
        if (value.valueOf() == reading.month.valueOf()) found = true
      })
      if (!found) arr = [...arr, reading.month]
    })
  )
  return arr
}

const getMonthReadingsFromRooms = (months, rooms) => {
  let _rooms = rooms
  let arr = []
  let columns = months
  if (!months || !rooms) return arr
  if (!Array.isArray(_rooms)) _rooms = [_rooms]
  _rooms.map((room) => {
    let row = {}
    columns.map((month, idx) => {
      row = { ...row, [idx]: null }
    })

    room.meterReadings.map((reading, idx) => {
      if (columns.includes(reading.month)) {
        row[idx] = reading
      }
    })
    arr = [...arr, row]
  })
  return arr
}

const addElementToArray = (element, array) => {
  if (!element || !array) return []
  if (!array.includes(element)) return [...array, element]
  return array
}

export function ReadingsEditor() {
  const constantColumns = ['pomieszczenie', 'firma']
  const [rooms, setRooms] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(null)
  const monthColumns = useMemo(() => {
    const months = getMonthsFromRooms(rooms)
    months.includes(selectedMonth) ? setEditMode(true) : setEditMode(false)
    return addElementToArray(selectedMonth, months)
  }, [rooms])
  const monthReadings = useMemo(() => {
    const readings = getMonthReadingsFromRooms(monthColumns, rooms)
    console.log(readings)
    return readings
  }, [monthColumns])
  const inputRef = useRef([])

  const getMeterReadingByMonth = (month, idx) => {
    try {
      let wanted = null
      rooms[idx].meterReadings.map((reading) => {
        if (reading.month === month) wanted = reading
      })
      return wanted
    } catch {
      return null
    }
  }

  const getPrevState = (rowIdx, columnIdx) => {
    try {
      const prevState = monthReadings[rowIdx][columnIdx - 1].state
      if (isNaN(+prevState)) return 0
      return prevState
    } catch {
      return 0
    }
  }

  const dateFormatArray = (array, dateFormat) => {
    let arr = []
    array.map((element) => {
      arr = [...arr, Moment(element).format(dateFormat)]
    })
    return arr
  }

  const onDatePickerChange = (date) => {
    const selected = date.date(1).format('YYYY-MM-DD')
    const prev = date.add(-1, 'month').date(1).format('YYYY-MM-DD')
    setSelectedMonth(selected)

    axios
      .get(
        `http://localhost:8000/api/rooms?start_month=${prev}&end_month=${selected}`
      )
      .then((res) => {
        setRooms(res.data)
      })
      .catch((error) => console.error(error))
  }

  const onSaveButtonClick = () => {
    let isChange = false
    let promises = inputRef.current.map(async (input, idx) => {
      const reading = getMeterReadingByMonth(selectedMonth, idx)
      if (reading?.state != input.value) {
        isChange = true
        if (reading) {
          return await axios
            .patch(`http://localhost:8000/api/meter_readings/${reading.id}`, {
              state: input.value,
            })
            .then((res) => {
              console.log(res.data)
              toast.success('Odczyt zapisany')
              return res.data
            })
            .catch((error) => {
              console.error(error)
              toast.error('Nie udało się zapisać odczytu')
            })
        } else {
          if (!input.value) return
          return await axios
            .post(`http://localhost:8000/api/meter_readings`, {
              state: input.value,
              room_id: rooms[idx].id,
              month: selectedMonth,
            })
            .then((res) => {
              console.log(res.data)
              toast.success('Odczyt zapisany')
              return res.data
            })
            .catch((error) => {
              console.error(error)
              toast.error('Nie udało się zapisać odczytu')
            })
        }
      }
    })

    if (isChange) {
      axios.all([...promises]).then(() => {
        const prev = dayjs(selectedMonth).add(-1, 'month').format('YYYY-MM-DD')
        axios
          .get(
            `http://localhost:8000/api/rooms?start_month=${prev}&end_month=${selectedMonth}`
          )
          .then((res) => {
            setRooms(res.data)
          })
          .catch((error) => console.error(error))
      })
    } else {
      toast.success('Wszystkie odczyty są aktualne')
    }
  }

  return (
    <>
      <div className="mt-12">
        <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
          <StatisticsCard
            title={'Miesiąc'}
            icon={React.createElement(CalendarIcon, {
              className: 'w-6 h-6 text-white',
            })}
            footer={
              <>
                <Typography className="font-normal text-blue-gray-600">
                  Wybierz miesiąc do rozliczenia
                </Typography>
                <div className="mt-4 flex w-full justify-center">
                  <DatePicker picker="month" onChange={onDatePickerChange} />
                </div>
              </>
            }
          />
          {editMode ? (
            <StatisticsCard
              title={'Uwaga'}
              color="red"
              icon={React.createElement(ExclamationTriangleIcon, {
                className: 'w-6 h-6 text-white',
              })}
              footer={
                <>
                  <Typography className="font-normal text-blue-gray-600">
                    Jesteś w trybie edycji. Modyfikacja odczytów będzie miała
                    wpływ na rozliczenia.
                  </Typography>
                </>
              }
            />
          ) : null}
          {monthReadings?.length > 0 ?? false ? (
            <StatisticsCard
              title={'Zapis'}
              icon={React.createElement(CheckIcon, {
                className: 'w-6 h-6 text-white',
              })}
              footer={
                <>
                  <Typography className="font-normal text-blue-gray-600">
                    Aby zapisać wprowadzone odczyty, naciśnij przycisk poniżej
                  </Typography>
                  <div className="mt-4 flex w-full justify-center">
                    <Button
                      className="bg-blue-600"
                      type="primary"
                      onClick={onSaveButtonClick}
                    >
                      Zapisz odczyty
                    </Button>
                  </div>
                </>
              }
            />
          ) : null}
        </div>
      </div>

      {monthReadings?.length > 0 ?? false ? (
        <div className="mt-12 mb-8 flex flex-col gap-12">
          <Card>
            <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
              <div className="inline-flex w-full justify-between">
                <Typography variant="h6" color="white">
                  Lista odczytów
                </Typography>
                <Button className="bg-white" onClick={onSaveButtonClick}>
                  Zapisz odczyty
                </Button>
              </div>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {[
                      ...constantColumns,
                      ...dateFormatArray(monthColumns, 'YYYY-MM'),
                    ].map((column) => (
                      <th
                        key={column}
                        className="border-b border-blue-gray-50 px-5 py-3 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400"
                        >
                          {column}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room, rowIdx) => {
                    const className = `py-3 px-5 ${
                      rowIdx === rooms.length - 1
                        ? ''
                        : 'border-b border-blue-gray-50'
                    }`

                    return (
                      <tr key={room?.name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {room?.name}
                              </Typography>
                              <Typography className="text-xs font-normal text-blue-gray-500">
                                {'INKUBATOR'}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {room?.company?.name ?? '-'}
                          </Typography>
                        </td>

                        {monthColumns.map((month, colIdx) => {
                          if (monthColumns.length - 1 !== colIdx) {
                            return (
                              <td className={className} key={month.id}>
                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                  {monthReadings[rowIdx][colIdx]?.state || null}
                                </Typography>
                                <Typography className="text-xs font-normal text-blue-gray-500">
                                  {'kW/h'}
                                </Typography>
                              </td>
                            )
                          } else {
                            return (
                              <td className={className} key={month.id}>
                                <div className="inline-flex h-full w-full items-center space-x-2">
                                  <InputNumber
                                    ref={(el) =>
                                      (inputRef.current[rowIdx] = el)
                                    }
                                    key={uuidv4()}
                                    min={getPrevState(rowIdx, colIdx)}
                                    addonAfter={'kW/h'}
                                    defaultValue={
                                      monthReadings[rowIdx][colIdx]?.state ??
                                      null
                                    }
                                    controls={false}
                                    keyboard={false}
                                  />
                                </div>
                              </td>
                            )
                          }
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
      ) : null}
    </>
  )
}

export default ReadingsEditor
