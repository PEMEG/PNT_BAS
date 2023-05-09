<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Invoice;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 3; $i++) {
            Invoice::create([
                'month' => sprintf('2023-%02d-01', $i),
                'consumption' => rand(6000, 6100),
                'cost' => rand(5000, 5100)
            ]);
        }
    }
}
