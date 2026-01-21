import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlay, FaPause, FaRedo } from "react-icons/fa";
import { useThemeStore } from "../../store";
import { useState, useEffect, useRef } from "react";

const FocusPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();

  // 时间设置
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);

  // 倒计时状态
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSettingMode, setIsSettingMode] = useState(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goBack = () => {
    navigate("/profile");
  };

  // 倒计时逻辑
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            alert("专注时间结束！");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // 开始专注
  const handleStart = () => {
    if (isSettingMode) {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      if (totalSeconds === 0) {
        alert("请设置专注时间");
        return;
      }
      setTimeLeft(totalSeconds);
      setIsSettingMode(false);
    }
    setIsRunning(true);
  };

  // 暂停
  const handlePause = () => {
    setIsRunning(false);
  };

  // 重置
  const handleReset = () => {
    setIsRunning(false);
    setIsSettingMode(true);
    setTimeLeft(hours * 3600 + minutes * 60 + seconds);
  };

  // 格式化时间显示
  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className={`focus-page ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="page-header">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>专注时间</h2>
      </div>

      <div className="focus-content">
        {/* 时钟显示区域 */}
        <div className="timer-display">
          <div className="timer-circle">
            <div className="timer-text">{formatTime(timeLeft)}</div>
            <div className="timer-label">
              {isRunning ? "专注中..." : isSettingMode ? "设置时间" : "已暂停"}
            </div>
          </div>
        </div>

        {/* 时间设置区域 */}
        {isSettingMode && (
          <div className="time-settings">
            <div className="time-input-group">
              <div className="time-input-item">
                <label>时</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                />
              </div>
              <span className="time-separator">:</span>
              <div className="time-input-item">
                <label>分</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                />
              </div>
              <span className="time-separator">:</span>
              <div className="time-input-item">
                <label>秒</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                />
              </div>
            </div>

            {/* 快捷时间按钮 */}
            <div className="quick-time-buttons">
              <button onClick={() => { setHours(0); setMinutes(15); setSeconds(0); }}>15分钟</button>
              <button onClick={() => { setHours(0); setMinutes(25); setSeconds(0); }}>25分钟</button>
              <button onClick={() => { setHours(0); setMinutes(45); setSeconds(0); }}>45分钟</button>
              <button onClick={() => { setHours(1); setMinutes(0); setSeconds(0); }}>1小时</button>
            </div>
          </div>
        )}

        {/* 控制按钮 */}
        <div className="control-buttons">
          {!isRunning ? (
            <button className="control-btn start-btn" onClick={handleStart}>
              <FaPlay size={20} />
              <span>开始</span>
            </button>
          ) : (
            <button className="control-btn pause-btn" onClick={handlePause}>
              <FaPause size={20} />
              <span>暂停</span>
            </button>
          )}
          <button className="control-btn reset-btn" onClick={handleReset}>
            <FaRedo size={18} />
            <span>重置</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusPage;
