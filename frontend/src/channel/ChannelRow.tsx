import ChannelRoom from "./ChannelRoom";
import './Channel.css';

interface ChannelData {
    chIdx: number;
    chName: string;
    chPwd: string;
    chUserCnt: number;
    ownerId: string;
}

function ChannelRow({
    channelData1,
    channelData2,
}: {
    channelData1: ChannelData;
    channelData2: ChannelData;
}) {
    return (
        <div className="chan-rowbox">
            <div className="chan-leftbox">
                <ChannelRoom channelData={channelData1} />
            </div>
            {channelData2 && (
                <div className="chan-rightbox">
                    <ChannelRoom channelData={channelData2} />
                </div>
            )}
            {!channelData2 && <div className="chan-empty_rightbox"></div>}
        </div>
    );
}

export default ChannelRow;
