<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        DB::table('settings')->insert([
            ['key' => 'hotel_name', 'value' => 'Fiesta Resort', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'address', 'value' => 'Sitio Dacuman, Barangay Ipil, Surigao City, 8400, PH', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'zip_code', 'value' => '8400', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'timezone', 'value' => 'pst', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'language', 'value' => 'english', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'date_format', 'value' => 'yyyy-mm-dd', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
