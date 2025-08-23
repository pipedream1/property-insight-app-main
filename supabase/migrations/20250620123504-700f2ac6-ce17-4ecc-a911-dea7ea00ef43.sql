
-- Check what water sources are currently in the database
SELECT DISTINCT component_name, component_type, COUNT(*) as reading_count
FROM water_readings 
WHERE component_name IS NOT NULL OR component_type IS NOT NULL
GROUP BY component_name, component_type
ORDER BY reading_count DESC;

-- Also check the structure to understand the current data
SELECT component_name, component_type, reading, date, comment
FROM water_readings 
ORDER BY date DESC 
LIMIT 10;
