"use client";
import { Student, Interaction, Communication, Note, Task } from "@/domain/types";
import { format, differenceInDays } from "date-fns";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface AISummaryProps {
  student: Student;
  interactions: Interaction[];
  communications: Communication[];
  notes: Note[];
  tasks: Task[];
}

export default function AISummary({ student, interactions, communications, notes, tasks }: AISummaryProps) {

  // Mock AI analysis based on student data
  function generateAISummary(): {
    engagement: string;
    riskLevel: "low" | "medium" | "high";
    recommendations: string[];
    keyInsights: string[];
  } {
    const daysSinceLastActive = differenceInDays(new Date(), student.lastActiveAt);
    const totalInteractions = interactions.length;
    const recentCommunications = communications.filter(
      c => differenceInDays(new Date(), c.createdAt) <= 7
    ).length;
    const pendingTasks = tasks.filter(t => t.status === "pending").length;
    const hasHighIntent = Array.isArray(student.flags) && student.flags.includes("high_intent");
    const needsEssayHelp = Array.isArray(student.flags) && student.flags.includes("needs_essay_help");

    // Engagement analysis
    let engagement = "Low";
    if (totalInteractions > 10 && daysSinceLastActive <= 3) {
      engagement = "High";
    } else if (totalInteractions > 5 && daysSinceLastActive <= 7) {
      engagement = "Medium";
    }

    // Risk level assessment
    let riskLevel: "low" | "medium" | "high" = "low";
    if (daysSinceLastActive > 14 || (hasHighIntent && daysSinceLastActive > 7)) {
      riskLevel = "high";
    } else if (daysSinceLastActive > 7 || pendingTasks > 2) {
      riskLevel = "medium";
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (daysSinceLastActive > 7) {
      recommendations.push("Send follow-up email to re-engage");
    }
    if (needsEssayHelp) {
      recommendations.push("Schedule essay writing workshop");
    }
    if (hasHighIntent && student.status === "Exploring") {
      recommendations.push("Provide college shortlisting guidance");
    }
    if (pendingTasks > 2) {
      recommendations.push("Prioritize pending tasks");
    }
    if (student.status === "Applying" && totalInteractions < 5) {
      recommendations.push("Increase application support");
    }

    // Generate key insights
    const keyInsights: string[] = [];
    if (hasHighIntent) {
      keyInsights.push("High-intent student - prioritize engagement");
    }
    if (needsEssayHelp) {
      keyInsights.push("Needs essay writing support");
    }
    if (totalInteractions > 8) {
      keyInsights.push("Very active on platform");
    }
    if (recentCommunications > 2) {
      keyInsights.push("Recently engaged via communications");
    }
    if (student.status === "Submitted") {
      keyInsights.push("Application submitted - follow up on results");
    }

    return {
      engagement,
      riskLevel,
      recommendations,
      keyInsights,
    };
  }

  const aiAnalysis = generateAISummary();

  const riskColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const engagementColors = {
    Low: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-green-100 text-green-800",
  };

  return (
    <Card className="p-5">
      <h2 className="font-medium mb-4 flex items-center gap-2">
        <span>🤖</span> AI Summary
      </h2>
      
      <div className="space-y-4">
        {/* Engagement & Risk Level */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-600 font-medium mb-1">Engagement Level</div>
            <Badge variant="custom" className={engagementColors[aiAnalysis.engagement as keyof typeof engagementColors]}>
              {aiAnalysis.engagement}
            </Badge>
          </div>
          <div>
            <div className="text-xs text-slate-600 font-medium mb-1">Risk Level</div>
            <Badge variant="custom" className={riskColors[aiAnalysis.riskLevel]}>
              {aiAnalysis.riskLevel.charAt(0).toUpperCase() + aiAnalysis.riskLevel.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Key Insights */}
        <div>
          <div className="text-xs text-slate-600 font-medium mb-2">Key Insights</div>
          <div className="space-y-1">
            {aiAnalysis.keyInsights.map((insight, index) => (
              <div key={index} className="text-sm text-slate-700 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <div className="text-xs text-slate-600 font-medium mb-2">AI Recommendations</div>
          <div className="space-y-1">
            {aiAnalysis.recommendations.map((rec, index) => (
              <div key={index} className="text-sm text-slate-700 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">→</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="pt-3 border-t border-slate-200">
          <div className="text-xs text-slate-600 font-medium mb-2">Activity Summary</div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Total Interactions:</span>
              <span className="font-medium">{interactions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Days Since Active:</span>
              <span className="font-medium">{differenceInDays(new Date(), student.lastActiveAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Recent Communications:</span>
              <span className="font-medium">{communications.filter(c => differenceInDays(new Date(), c.createdAt) <= 7).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Pending Tasks:</span>
              <span className="font-medium">{tasks.filter(t => t.status === "pending").length}</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-3 border-t border-slate-200">
          <div className="text-xs text-slate-500 italic">
            * AI analysis based on student interactions, communications, and profile data. 
            Recommendations are suggestions and should be reviewed by your team.
          </div>
        </div>
      </div>
    </Card>
  );
}
