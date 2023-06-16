import ChannelRoom from "./ChannelRoom";

function ChannelRow() {
    return <div className="chan-rowbox">
    <div className="chan-leftbox">
        <ChannelRoom></ChannelRoom>
    </div>
    <div className="chan-rightbox">
        <ChannelRoom></ChannelRoom>
    </div>
</div>
}

export default ChannelRow;