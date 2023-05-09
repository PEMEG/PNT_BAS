import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from '@material-tailwind/react'
import { StatisticsCard } from '@/widgets/cards'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import Moment from 'moment'
import { DatePicker, Button } from 'antd'
import dayjs from 'dayjs'
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom'

export function Readings() {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState({})
  const [companies, setCompanies] = useState({})
  const [loading, setLoading] = useState(true)
  const { RangePicker } = DatePicker
  const rangePickerDefaultValue = [dayjs().add(-2, 'M'), dayjs()]

  const getMonthColumns = () => {
    let arr = []
    rooms.map((room) =>
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

  const formatArray = (array, dateFormat) => {
    let arr = []
    array.map((element) => {
      arr = [...arr, Moment(element).format(dateFormat)]
    })
    return arr
  }

  const onRangePickerChange = (dateRange) => {
    const start = dateRange[0].date(1).format('YYYY-MM-DD')
    const end = dateRange[1].date(1).format('YYYY-MM-DD')

    axios
      .get(
        `http://localhost:8000/api/rooms?start_month=${start}&end_month=${end}`
      )
      .then((res) => {
        setRooms(res.data)
        console.log(res.data)
      })
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    const start = rangePickerDefaultValue[0].date(1).format('YYYY-MM-DD')
    const end = rangePickerDefaultValue[1].date(1).format('YYYY-MM-DD')

    axios
      .get(
        `http://localhost:8000/api/rooms?start_month=${start}&end_month=${end}`
      )
      .then((res) => {
        setRooms(res.data)
        console.log(res.data)
      })
      .catch((error) => console.error(error))

    axios
      .get(`http://localhost:8000/api/companies`)
      .then((res) => {
        setCompanies(res.data)
        console.log(res.data)
      })
      .catch((error) => console.error(error))
  }, [])

  useEffect(() => {
    if (Object.keys(rooms).length === 0) return
    if (Object.keys(companies).length === 0) return
    setLoading(false)
    console.log(getMonthColumns())
  }, [rooms, companies])

  if (!loading) {
    return (
      <>
        <div className="mt-12">
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
            <StatisticsCard
              title={'Edytor'}
              icon={React.createElement(PencilSquareIcon, {
                className: 'w-6 h-6 text-white',
              })}
              footer={
                <>
                  <Typography className="font-normal text-blue-gray-600">
                    Chcesz dodać nowy odczyt lub edytować już istniejący?
                  </Typography>
                  <div className="mt-4 flex w-full justify-center">
                    <Button
                      onClick={() => navigate('/dashboard/odczyty/edytor')}
                    >
                      Przejdź do edytora
                    </Button>
                  </div>
                </>
              }
            />
          </div>
        </div>

        <div className="mt-12 mb-8 flex flex-col gap-12">
          <Card>
            <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
              <div className="inline-flex w-full justify-between">
                <Typography variant="h6" color="white">
                  Lista odczytów
                </Typography>
                <RangePicker
                  picker="month"
                  defaultValue={rangePickerDefaultValue}
                  onChange={onRangePickerChange}
                />
              </div>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {[
                      'Pomieszczenie',
                      'firma',
                      ...formatArray(getMonthColumns(), 'YYYY-MM'),
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
                  {rooms.map((room, key) => {
                    const className = `py-3 px-5 ${
                      key === rooms.length - 1
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
                        {room?.meterReadings?.map((reading) => (
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {reading.state}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {'kW/h'}
                            </Typography>
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
      </>
    )
  }
}

export default Readings
