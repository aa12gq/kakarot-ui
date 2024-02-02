import _ from "lodash";

interface User {
    name: string;
    gender: string;
    email: string;
    avatar: string
    job: string
}

const fakeData: Array<{users: User[]}> = [
    {users: [
            {
                name: "刘新能",
                gender: "男",
                email: "xinneng@veigine.com",
                avatar: "/src/assets/images/avatar_default.png",
                job: "高级电焊工"
            }
        ]}
];

export default fakeData;