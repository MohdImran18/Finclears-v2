<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EmployeeMonitoringSignal implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $sessionId,
        public int $senderId,
        public string $signalType,
        public array $payload
    ) {
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('employee-monitoring.session.'.$this->sessionId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'employee.monitoring.signal';
    }

    public function broadcastWith(): array
    {
        return [
            'session_id' => $this->sessionId,
            'sender_id' => $this->senderId,
            'signal_type' => $this->signalType,
            'payload' => $this->payload,
            'sent_at' => now()->toISOString(),
        ];
    }
}