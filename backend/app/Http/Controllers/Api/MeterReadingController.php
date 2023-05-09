<?php

namespace App\Http\Controllers\Api;

use App\Models\MeterReading;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMeterReadingRequest;
use App\Http\Requests\UpdateMeterReadingRequest;
use App\Http\Resources\MeterReadingCollection;
use App\Http\Resources\MeterReadingResource;
use App\Http\Resources\MeterReading\DefaultResource as DefaultMeterReadingResource;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Services\MeterReadingQuery;

class MeterReadingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        if ($request->month) {
            return DefaultMeterReadingResource::collection(MeterReading::where('month', '=', $request->month)->get());
        }

        if ($request->group_by) {
            return MeterReading::with('room')->get()->groupBy('room.name');
        }

        return DefaultMeterReadingResource::collection(MeterReading::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMeterReadingRequest $request)
    {
        return new DefaultMeterReadingResource(MeterReading::create($request->all()));
    }

    /**
     * Display the specified resource.
     */
    public function show(MeterReading $meterReading)
    {
        return new DefaultMeterReadingResource($meterReading);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MeterReading $meterReading)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMeterReadingRequest $request, MeterReading $meterReading)
    {
        $meterReading->update($request->all());
        return new DefaultMeterReadingResource($meterReading);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MeterReading $meterReading)
    {
        if ($meterReading->deleteOrFail() === false) {
            return Response::HTTP_BAD_REQUEST;
        }

        return Response::HTTP_OK;
    }
}
