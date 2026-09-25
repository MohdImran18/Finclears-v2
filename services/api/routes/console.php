<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('leads:expire-ownership')
    ->hourly();

Schedule::command('leads:send-followup-reminders')
    ->hourly();