<template>
  <div id="app">
    <h1>Event Calendar</h1>
    <EventCalendar />
    <SchedulerCalendar/>
    <DateScheduler/>
    <RangeScheduler/>
  </div>
</template>

<script>
import EventCalendar from './components/EventCalendar.vue';
import SchedulerCalendar from './components/SchedulerCalendar.vue';
import DateScheduler from './components/DateScheduler.vue';
import RangeScheduler from './components/RangeScheduler.vue';
export default {
  components: {
    EventCalendar,
    SchedulerCalendar,
    DateScheduler,
    RangeScheduler
  },
};
</script>

<style>
#app {
  text-align: center;
}
</style>
