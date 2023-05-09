import React from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from '@material-tailwind/react'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import dayjs from 'dayjs'

export function Invoices() {
  const columns = [
    'faktura',
    'miesiąc',
    'zużycie',
    'koszt netto',
    'koszt 1 kW/h',
  ]
  const [loading, setLoading] = useState(true)
  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/invoices`)
      .then((res) => {
        setInvoices(res.data)
        console.log(res.data)
        setLoading(false)
      })
      .catch((error) => console.error(error))
  }, [])

  return (
    <>
      {!loading ? (
        <div className="mt-12 mb-8 flex flex-col gap-12">
          <Card>
            <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
              <div className="inline-flex w-full justify-between">
                <Typography variant="h6" color="white">
                  Lista faktur
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
                  {invoices.map((invoice, rowIdx) => {
                    const className = `py-3 px-5 ${
                      rowIdx === invoices.length - 1
                        ? ''
                        : 'border-b border-blue-gray-50'
                    }`

                    return (
                      <tr key={`invoice_${invoice?.id}`}>
                        <td className={className}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {`Faktura za ${dayjs(invoice?.month).format(
                              'YYYY-MM'
                            )}`}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {dayjs(invoice?.month).format('YYYY-MM')}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {invoice?.consumption}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {'kW/h'}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {invoice?.cost}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {'zł'}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {Math.round(
                              (invoice?.consumption / invoice?.cost +
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

export default Invoices
