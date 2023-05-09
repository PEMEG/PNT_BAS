<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 23; $i++) {
            Room::create([
                'name' => sprintf('INK 1.%02d', $i),
                'company_id' => null
            ]);
        }

        for ($i = 1; $i <= 21; $i++) {
            Room::create([
                'name' => sprintf('INK 2.%02d', $i),
                'company_id' => null
            ]);
        }

        for ($i = 1; $i <= 16; $i++) {
            Room::create([
                'name' => sprintf('INK 3.%02d', $i),
                'company_id' => null
            ]);
        }
    }
}
