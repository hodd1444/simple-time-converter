"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Plus,
  Locate,
  Github,
  ChevronDown,
  Trash,
  Trash2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { formatInTimeZone, getTimezoneOffset } from "date-fns-tz";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const timezones = [
  "UTC",
  "PST",
  "EST",
  "America/New_York",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
  "Europe/Paris",
  "Asia/Dubai",
  "America/Los_Angeles",
  "Asia/Singapore",
];

export default function Component({ API_KEY }: any) {
  const [sourceTimezone, setSourceTimezone] = useState("UTC");
  const [sourceTime, setSourceTime] = useState(
    format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );
  const [targetTimezones, setTargetTimezones] = useState(["UTC"]);
  const [convertedTimes, setConvertedTimes] = useState<{
    [key: string]: string;
  }>({});
  const [timeFormat, setTimeFormat] = useState("24h");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");

  useEffect(() => {
    convertTime();
  }, [sourceTimezone, sourceTime, targetTimezones, timeFormat, dateFormat]);

  const convertTime = () => {
    const sourceDate = parseISO(sourceTime);
    const sourceOffset = getTimezoneOffset(sourceTimezone, sourceDate);
    const utcTime = new Date(sourceDate.getTime() - sourceOffset);

    const newConvertedTimes: { [key: string]: string } = {};
    targetTimezones.forEach((tz) => {
      const convertedTime = formatInTimeZone(
        utcTime,
        tz,
        getTimeFormatString()
      );
      newConvertedTimes[tz] = convertedTime;
    });
    setConvertedTimes(newConvertedTimes);
  };

  const getTimeFormatString = () => {
    let dateF;
    let timeF;

    switch (dateFormat) {
      case "MM/DD/YYYY":
        dateF = "MM/dd/yyyy";
        break;
      case "DD.MM.YYYY":
        dateF = "dd.MM.yyyy";
        break;
      case "YYYY-MM-DD":
        dateF = "yyyy-MM-dd";
        break;
      default:
        dateF = "MM/dd/yyyy";
        break;
    }

    switch (timeFormat) {
      case "24h":
        timeF = "HH:mm";
        break;
      case "AM/PM":
        timeF = "hh:mm a";
        break;
      case "Zulu":
        timeF = "HHmm'z'";
        break;
      default:
        timeF = "HH:mm";
        break;
    }

    return `${timeF} '⠀' ${dateF}`;
  };

  const addTargetTimezone = () => {
    const remainingTimezones = timezones.filter(
      (tz) => !targetTimezones.includes(tz)
    );
    if (remainingTimezones.length > 0) {
      setTargetTimezones([...targetTimezones, remainingTimezones[0]]);
    }
  };

  const removeTargetTimezone = (index: any) => {
    if (targetTimezones.length > 1) {
      const newTargetTimezones = targetTimezones.filter((_, i) => i !== index);
      setTargetTimezones(newTargetTimezones);
    }
  };

  const removeAllTargetTimezones = () => {
    setTargetTimezones([targetTimezones[0]]);
  };

  const useCurrentTime = () => {
    setSourceTime(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(
            `https://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=position&lat=${latitude}&lng=${longitude}`
          )
            .then((response) => response.json())
            .then((data) => {
              setSourceTimezone(data.zoneName);
            })
            .catch((error) => console.error("Error fetching timezone:", error));
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-3xl w-full z-10">
        <div className="flex items-center justify-center mb-8">
          <Clock className="h-12 w-12 text-teal-400 mr-4" />
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500">
            Simple Time Converter
          </h1>
        </div>
        <Card className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg border border-gray-700 shadow-xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Source Timezone
                </label>
                <Select
                  value={sourceTimezone}
                  onValueChange={setSourceTimezone}
                >
                  <SelectTrigger className="bg-gray-700 bg-opacity-50 border-gray-600 text-gray-100">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Source Time
                </label>
                <Input
                  type="datetime-local"
                  value={sourceTime}
                  onChange={(e) => setSourceTime(e.target.value)}
                  className="bg-gray-700 bg-opacity-50 border-gray-600 text-gray-100 placeholder-gray-400"
                />
              </div>
            </div>
            <Button
              onClick={useCurrentTime}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Locate className="h-4 w-4 mr-2" />
              Use Current Time & Location
            </Button>
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">
                Converted Times
              </h2>
              {targetTimezones.map((tz, index) => (
                <div
                  key={index}
                  className="mb-4 flex flex-row justify-between gap-4 align-middle items-center"
                >
                  <Select
                    value={tz}
                    onValueChange={(newTz) => {
                      const newTargetTimezones = [...targetTimezones];
                      newTargetTimezones[index] = newTz;
                      setTargetTimezones(newTargetTimezones);
                    }}
                  >
                    <SelectTrigger className="bg-gray-700 bg-opacity-50 border-gray-600 text-gray-100 w-1/4 h-full">
                      <SelectValue placeholder={tz} />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((timezone) => (
                        <SelectItem key={timezone} value={timezone}>
                          {timezone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex mt-2 p-4 bg-gray-700 bg-opacity-50 rounded-lg w-3/4 justify-center">
                    <p className="text-2xl font-bold text-gray-100">
                      {convertedTimes[tz]}
                    </p>
                  </div>
                  {targetTimezones.length > 1 && (
                    <Button
                      onClick={() => removeTargetTimezone(index)}
                      className="ml-2 bg-red-400 hover:bg-red-500"
                      size="icon"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                onClick={addTargetTimezone}
                className="mt-4 bg-teal-600 hover:bg-teal-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Timezone
              </Button>
              {targetTimezones.length > 1 && (
                <Button
                  onClick={removeAllTargetTimezones}
                  className="bg-red-400 hover:bg-red-500 text-white ml-4"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="mt-4 flex flex-row flex-wrap justify-between gap-4 align-middle items-center">
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gray-700 bg-opacity-50 border-gray-600 text-gray-100"
                >
                  Time Format: {timeFormat.toUpperCase()}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700">
                <DropdownMenuItem
                  onClick={() => setTimeFormat("24h")}
                  className="text-gray-100 hover:bg-gray-700"
                >
                  24-hour
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTimeFormat("AM/PM")}
                  className="text-gray-100 hover:bg-gray-700"
                >
                  AM/PM
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTimeFormat("Zulu")}
                  className="text-gray-100 hover:bg-gray-700"
                >
                  Zulu
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gray-700 bg-opacity-50 border-gray-600 text-gray-100"
                >
                  Date Format: {dateFormat}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700">
                <DropdownMenuItem
                  onClick={() => setDateFormat("MM/DD/YYYY")}
                  className="text-gray-100 hover:bg-gray-700"
                >
                  MM/DD/YYYY
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDateFormat("DD.MM.YYYY")}
                  className="text-gray-100 hover:bg-gray-700"
                >
                  DD.MM.YYYY
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDateFormat("YYYY-MM-DD")}
                  className="text-gray-100 hover:bg-gray-700"
                >
                  YYYY-MM-DD
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-400 z-10">
        <p>© 2024 Hodd. All rights reserved.</p>
        <a
          href="https://github.com/hodd1444/simple-time-converter"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-2 text-teal-400 hover:text-teal-300"
        >
          <Github className="h-4 w-4 mr-2" />
          View on GitHub
        </a>
      </footer>
    </div>
  );
}
