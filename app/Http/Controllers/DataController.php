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
        $data = Demo::all(); // Fetch all active (non-archived) records from the demo table
        return response()->json($data);
    }

    public function fetchArchivedData()
    {
        $data = Demo::onlyTrashed()->get(); // Fetch only soft-deleted (archived) records
        // Add deleted_at as archived_at for frontend consistency
        $data->each(function ($item) {
            $item->archived_at = $item->deleted_at;
        });
        return response()->json($data);
    }

    public function update(Request $request, $id)
    {
        // Validate the request
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
        ]);

        // Find the record by ID and update it
        $demo = Demo::findOrFail($id);
        $demo->update([
            'first_name' => $validated['firstName'],
            'last_name' => $validated['lastName'],
        ]);

        return response()->json(['message' => 'Data updated successfully!'], 200);
    }

    public function destroy($id)
    {
        $data = Demo::findOrFail($id); // replace Demo with your model
        $data->delete();

        return response()->json(['message' => 'Data deleted successfully']);
    }

    public function archive($id)
    {
        $data = Demo::findOrFail($id);
        $data->delete(); // This will soft delete the record

        return response()->json(['message' => 'Data archived successfully']);
    }
}