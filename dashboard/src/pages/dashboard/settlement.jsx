import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from '@material-tailwind/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { StatisticsCard } from '@/widgets/cards'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { CalendarIcon } from '@heroicons/react/24/solid'
import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

const getConsumptionFromRooms = (rooms, selectedMonth) => {
  let arr = []
  if (!rooms) return arr
  if (rooms.length === 0) return arr
  arr = rooms.map((room) => {
    const prev =
      room.meterReadings.find((reading) => {
        const prevMonth = dayjs(selectedMonth)
          .add(-1, 'month')
          .format('YYYY-MM-DD')
        return prevMonth === reading.month
      }) ?? null

    const selected =
      room.meterReadings.find((reading) => {
        return selectedMonth === reading.month
      }) ?? null

    if (!prev) return selected?.state ?? null
    if (!selected) return null
    return selected?.state - prev?.state
  })
  // console.log(arr)
  return arr
}

export function Settlement() {
  const columns = ['Pomieszczenie', 'Firma', 'zużycie', 'koszt netto']
  const [loading, setLoading] = useState(true)
  const [rooms, setRooms] = useState([])
  const [invoice, setInvoice] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(null)
  const unitCost = useMemo(() => {
    if (!invoice) return null
    if (invoice.length == 0) return null
    return (
      Math.round(
        (invoice[0].consumption / invoice[0].cost + Number.EPSILON) * 100
      ) / 100
    )
  }, [invoice])
  const consumptionList = useMemo(
    () => getConsumptionFromRooms(rooms, selectedMonth),
    [rooms]
  )
  const showWarning = useMemo(() => {
    if (!selectedMonth) return false
    if (Object.keys(consumptionList).length === 0) return false
    return !consumptionList.some((cons) => cons !== null)
  }, [consumptionList])

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
        // console.log(res.data)
      })
      .catch((error) => console.error(error))

    axios
      .get(`http://localhost:8000/api/invoices?month=${selected}`)
      .then((res) => {
        setInvoice(res.data)
        // console.log(res.data)
      })
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    if (rooms.length === 0) return
    if (invoice.length === 0) return
    if (consumptionList.lenght === 0) return
    const hasConsumption = consumptionList.some((cons) => cons !== null)
    hasConsumption ? setLoading(false) : setLoading(true)
    console.log(Object.keys(consumptionList).length)
  }, [rooms, invoice, consumptionList])

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
          {showWarning ? (
            <StatisticsCard
              title={'Uwaga'}
              color="red"
              icon={React.createElement(ExclamationTriangleIcon, {
                className: 'w-6 h-6 text-white',
              })}
              footer={
                <>
                  <Typography className="font-normal text-blue-gray-600">
                    Podany miesiąc nie został rozliczony. Wprowadź fakturę oraz
                    odczyty aby wyświetlić rozliczenie.
                  </Typography>
                </>
              }
            />
          ) : null}
        </div>
      </div>

      {!loading ? (
        <div className="mt-12 mb-8 flex flex-col gap-12">
          <Card>
            <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
              <div className="inline-flex w-full justify-between">
                <Typography variant="h6" color="white">
                  {`Rozliczenie za ${dayjs(selectedMonth).format('YYYY-MM')}`}
                </Typography>
              </div>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {columns.map((column) => (
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
                      <tr key={uuidv4()}>
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
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {consumptionList[rowIdx] ?? null}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {'kW/h'}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {Math.round(
                              (consumptionList[rowIdx] * unitCost +
                                Number.EPSILON) *
                                100
                            ) / 100}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {'zł'}
                          </Typography>
                        </td>
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

export default Settlement
