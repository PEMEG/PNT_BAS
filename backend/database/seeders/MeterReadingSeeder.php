<?php

namespace Database\Seeders;

use App\Models\MeterReading;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MeterReadingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = DB::table('rooms')->count();

        for ($room_idx = 1; $room_idx <= $rooms; $room_idx++) {

            $rand_state = rand(10, 1000);

            for ($month_idx = 1; $month_idx <= 3; $month_idx++) {

                $rand_state = $rand_state + rand(10, 100);

                MeterReading::create([
                    'state' => $rand_state,
                    'month' => sprintf('2023-%02d-01', $month_idx),
                    'room_id' => $room_idx,
                    'unit_cost' => null
                ]);
            }
        }
    }
}
