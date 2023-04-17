import {Navbar} from "@nextui-org/react";
import {useState} from "react";
import {HistoryItem} from "@/app/components/slider/index";

export function MobileSlider(props: { collapse: boolean, setCollapse: (collapse: boolean) => void }) {
    const [historyList, setHistoryList] = useState<HistoryItem[]>(
        JSON.parse(localStorage.getItem("historyList") || "[]")
    );
    return (
        <Navbar.Collapse isOpen={props.collapse}>
            {historyList.map((item, index) => (
                <Navbar.CollapseItem key={index}>
                    <a color="inherit" onClick={() => {
                        props.setCollapse(false);
                    }}>{item.title}</a>
                </Navbar.CollapseItem>
            ))}
        </Navbar.Collapse>
    );
}
