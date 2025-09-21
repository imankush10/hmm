#!/bin/bash

# --- Frame Processing Script ---
# This script duplicates the first frame of a sequence and shifts the rest.
# It assumes you have files named frame0001.jpg through frame0316.jpg
# in the same directory where you run this script.

# Create a new directory for the final, reordered sequence.
echo "Creating 'final_frames' directory..."
mkdir final_frames

# Step 1: Duplicate the first frame 10 times.
echo "Duplicating frame 1 into the first 10 positions..."
for i in {1..10}
do
  # Format the number with 4 digits (e.g., 0001, 0002).
  new_name=$(printf "frame_%04d.jpg" $i)
  cp frame_0001.jpg "final_frames/$new_name"
done

# Step 2: Copy and shift the remaining frames (from 2 to 316).
echo "Shifting frames 2 through 316..."
for i in {2..316}
do
  old_name=$(printf "frame_%04d.jpg" $i)
  # Calculate the new frame number by adding the 19-frame offset.
  new_name=$(printf "frame_%04d.jpg" $((i + 10)))
  cp "$old_name" "final_frames/$new_name"
done

echo "Done! Your new sequence is in the 'final_frames' directory."
