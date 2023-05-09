<?php

namespace App\Http\Controllers\Api;

use App\Models\Room;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Http\Resources\Room\DefaultResource as DefaultRoomResource;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // return Room::all();

        if ($request->start_month && $request->end_month) {
            return DefaultRoomResource::collection(
                Room::meterReadingsDateRange(
                    $request->start_month,
                    $request->end_month
                )->get()
            );
        }

        // return new RoomCollection(Room::all());
        return DefaultRoomResource::collection(Room::all());
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
    public function store(StoreRoomRequest $request)
    {
        return new DefaultRoomResource(Room::create($request->all()));
    }

    /**
     * Display the specified resource.
     */
    public function show(Room $room)
    {
        return new DefaultRoomResource($room);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Room $room)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoomRequest $request, Room $room)
    {
        $room->update($request->all());
        return new DefaultRoomResource($room);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Room $room)
    {
        if ($room->deleteOrFail() === false) {
            return Response::HTTP_BAD_REQUEST;
        }

        return Response::HTTP_OK;
    }
}
