import React, { useState } from "react";
import { View, ScrollView, AsyncStorage } from "react-native";
import SchedualRendering from "../components/SchedualRendering";
import schedualStyles from "../styles/schedualStyles";
import Notification from "../components/Notification";

export default function Schedual() {
    const [countLoops, setCountLoops] = useState(0);

    const [countLessons, setCountLessons] = useState(0); // номер урока
    const [nextLessonHours, setNextLessonHours] = useState(22); //8
    const [nextLessonMinutes, setNextLessonMinutes] = useState(57); // 0
    const [nextLesson, setNextLesson] = useState(""); // ""

    async function setNewDataAboutLesson(lessonNumber) {
        const schedual = await AsyncStorage.getItem('Schedual');
        // let weekDay = Алгоритм нахождения дня недели
        // условие, если уроков на сегодня больше нет, то меняем данные об уроке на урок следующего дня (убрать условие из useEffet) 
        setNextLesson(JSON.parse(schedual)['Понедельник'][lessonNumber]['lessonName']);

        let lessonHours = JSON.parse(schedual)['Понедельник'][lessonNumber]['lessonTime'];
        setNextLessonHours(parseInt(lessonHours[lessonHours.lenth - 5]) * 10 + parseInt(lessonHours[lessonHours.lenth - 4]));

        let lessonMinutes = JSON.parse(schedual)['Понедельник'][lessonNumber]['lessonTime'];
        setNextLessonMinutes(parseInt(lessonMinutes[lessonMinutes.lenth - 5]) * 10 + parseInt(lessonMinutes[lessonMinutes.lenth - 4]));

    }

    React.useEffect(() => {
        setTimeout(() => {

            let todayTime = new Date(); // время в данный момент
            let hours = todayTime.getHours(); // часы
            let minutes = todayTime.getMinutes(); // минуты

            if ((hours + 3) % 24 === 7 && (minutes === 50 || minutes > 50)) {
                setCountLessons(0);
                setNewDataAboutLesson(countLessons);
            } else {
                if ((hours + 3) % 24 === nextLessonHours && (minutes === nextLessonMinutes || minutes > nextLessonMinutes)) {
                    // console.log("sdfs") // - тест
                    Notification.schoolSchedualNotification("Следующий урок", nextLesson)
                    console.log(((hours + 3) % 24 === nextLessonHours && (minutes === nextLessonMinutes || minutes > nextLessonMinutes)))
                    setCountLessons(countLessons + 1);
                    setNewDataAboutLesson(countLessons);// присваивание переменным nextLesson, nextLessonHours и nextLessonMinutes новый значений из локального хранилища
                    // !трижды отправляется уведомление, затем больше ничего не идёт!
                }

                setCountLoops(countLoops + 1);
            }
        }, 10000); // 120000
    });

    return (
        <View>
            <ScrollView>
                <View style={schedualStyles.item}>
                    <SchedualRendering weekDayName={'Понедельник'} />
                </View>
                <View style={schedualStyles.item}>
                    <SchedualRendering weekDayName={'Вторник'} />
                </View>
                <View style={schedualStyles.item}>
                    <SchedualRendering weekDayName={'Среда'} />
                </View>
                <View style={schedualStyles.item}>
                    <SchedualRendering weekDayName={'Четверг'} />
                </View>
                <View style={schedualStyles.item}>
                    <SchedualRendering weekDayName={'Пятница'} />
                </View>
            </ScrollView>
        </View>
    );
}