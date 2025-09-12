<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Demo;

class DataController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
        ]);

        // Save the data to the database
        Demo::create([
            'first_name' => $validated['firstName'],
            'last_name' => $validated['lastName'],
        ]);

        return response()->json(['message' => 'Data saved successfully!'], 200);
    }

    public function fetchData()
    {
        $data = Demo::all(); // Fetch all records from the demo table
        return response()->json($data);
    }
}