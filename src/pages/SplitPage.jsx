import Header from "../components/Header";
import BottomNav from "../components/Nav";

const defaultSplit = [
    { day: "Monday", exercises: [] },
    { day: "Tuesday", exercises: [] },
    { day: "Wednesday", exercises: [] },
    { day: "Thursday", exercises: [] },
    { day: "Friday", exercises: [] },
];

export default function SplitPage() {
    
    return (

        <div className="min-h-screen pt-16 pb-16 px-7 md:mx-20 lg:mx-50">
            {/* Header */}
            <Header
                title="Splits"
                profileImage="https://i.pravatar.cc/150?img=3" // demo avatar
            />



            {/* Bottom Navigation */}
            <BottomNav currPage={"Profile"} />

        </div>
    );
}
