<template>
    <div>
      <h2>Event Calendar</h2>
      <div class="calendar">
        <div class="header">
          <button @click="prevMonth">Prev</button>
          <h3>{{ monthNames[currentMonth] }} {{ currentYear }}</h3>
          <button @click="nextMonth">Next</button>
        </div>
        <div class="days">
          <div class="day" v-for="day in weekDays" :key="day">{{ day }}</div>
          <div
            class="date"
            v-for="date in datesInMonth"
            :key="date.date"
            :class="{ 
              today: isToday(date.date), 
              selected: isSelected(date.date), 
              highlighted: isDateInRange(date.date) 
            }"
            @click="selectDate(date.date)"
          >
            {{ date.date }}
            <div v-if="events[selectedDateString(date.date)]">
              <ul>
                <li v-for="event in events[selectedDateString(date.date)]" :key="event.title">
                  {{ event.title }} ({{ event.startDate }} - {{ event.endDate }})
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  
      <div v-if="selectedDate">
        <h3>Add Event</h3>
        <input v-model="newEvent.title" placeholder="Event Title" />
        <input type="date" v-model="newEvent.startDate" placeholder="Start Date" />
        <input type="date" v-model="newEvent.endDate" placeholder="End Date" />
        <button @click="addEvent">Add Event</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  
  export default {
    setup() {
      const currentMonth = ref(new Date().getMonth());
      const currentYear = ref(new Date().getFullYear());
      const selectedDate = ref(null);
      const newEvent = ref({ title: '', startDate: '', endDate: '' });
      const events = ref({
        '2024-10-03': [{ title: 'Doctor Appointment', startDate: '2024-10-03', endDate: '2024-10-03' }],
        '2024-10-15': [{ title: 'Project Deadline', startDate: '2024-10-15', endDate: '2024-10-15' }],
        '2024-10-20': [{ title: 'Birthday Party', startDate: '2024-10-20', endDate: '2024-10-22' }],
        '2024-10-25': [{ title: 'Conference', startDate: '2024-10-25', endDate: '2024-10-27' }],
      });
  
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
  
      const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
      const datesInMonth = computed(() => {
        const dateArray = [];
        const firstDay = new Date(currentYear.value, currentMonth.value, 1);
        const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
        
        // Fill empty slots for days before the first day of the month
        for (let i = 0; i < firstDay.getDay(); i++) {
          dateArray.push({ date: '' });
        }
  
        // Add all dates of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
          dateArray.push({ date: day });
        }
        return dateArray;
      });
  
      const selectedDateString = (day) => {
        return `${currentYear.value}-${currentMonth.value + 1}-${day}`;
      };
  
      const selectDate = (day) => {
        if (day) {
          selectedDate.value = selectedDateString(day);
        }
      };
  
      const addEvent = () => {
        if (newEvent.value.title && newEvent.value.startDate && newEvent.value.endDate) {
          const startDateKey = newEvent.value.startDate;
          if (!events.value[startDateKey]) {
            events.value[startDateKey] = [];
          }
          events.value[startDateKey].push({
            title: newEvent.value.title,
            startDate: newEvent.value.startDate,
            endDate: newEvent.value.endDate,
          });
  
          // Reset the form
          newEvent.value = { title: '', startDate: '', endDate: '' };
        }
      };
  
      const prevMonth = () => {
        if (currentMonth.value === 0) {
          currentMonth.value = 11;
          currentYear.value--;
        } else {
          currentMonth.value--;
        }
      };
  
      const nextMonth = () => {
        if (currentMonth.value === 11) {
          currentMonth.value = 0;
          currentYear.value++;
        } else {
          currentMonth.value++;
        }
      };
  
      const isToday = (day) => {
        const today = new Date();
        return (
          today.getDate() === day &&
          today.getMonth() === currentMonth.value &&
          today.getFullYear() === currentYear.value
        );
      };
  
      const isSelected = (day) => {
        const selected = new Date(selectedDate.value);
        return selected.getDate() === day &&
               selected.getMonth() === currentMonth.value &&
               selected.getFullYear() === currentYear.value;
      };
  
      const isDateInRange = (day) => {
        const date = new Date(currentYear.value, currentMonth.value, day);
        for (const key in events.value) {
          events.value[key].forEach(event => {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);
            if (date >= startDate && date <= endDate) {
              return true; // Date is in range
            }
          });
        }
        return false; // Date is not in range
      };
  
      return {
        currentMonth,
        currentYear,
        monthNames,
        weekDays,
        datesInMonth,
        selectDate,
        selectedDate,
        newEvent,
        addEvent,
        prevMonth,
        nextMonth,
        events,
        isToday,
        isSelected,
        selectedDateString,
        isDateInRange,
      };
    },
  };
  </script>
  
  <style scoped>
  .calendar {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
  }
  
  .days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
  }
  
  .day, .date {
    padding: 10px;
    text-align: center;
    border: 1px solid #ccc;
    position: relative;
  }
  
  .date:hover {
    background-color: #e0e0e0;
    cursor: pointer;
  }
  
  .today {
    background-color: #ffeb3b; /* Highlight today's date */
    font-weight: bold;
  }
  
  .selected {
    background-color: #2196F3; /* Highlight selected date */
    color: white;
  }
  
  .highlighted {
    background-color: #76ff03; /* Highlighted range for events */
  }
  
  .date ul {
    list-style-type: none;
    padding: 0;
    margin: 5px 0 0 0;
    font-size: 12px; /* Smaller font for events */
  }
  
  .date li {
    background-color: #f0f0f0; /* Background for events */
    border-radius: 3px;
    margin: 2px 0;
    padding: 2px;
  }
  </style>
  