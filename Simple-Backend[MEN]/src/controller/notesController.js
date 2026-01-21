import Note from "../model/Note.js"

export async function getAllNotes(req, res, next) {
    try {
        const notes = await Note.find();
        return res.status(200).json({ success: true, notes })
    } catch (error) {
        next(error)
    }
};

export async function getNoteById(req, res, next) {
    try {
        const note = await User.findById(req.params.id);

        // Multi-user backend and Concurrency perpose - checking is essential
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        return res.status(200).json({ success: true, note })
    } catch (error) {
        next(error)
    }
}

export async function createNote(req, res, next) {
    try {
        await Note.create(req.body)
        return res.status(201).json({
            success: true,
            message: "Note Created Successfully"
        })
    } catch (error) {
        next(error)
    }
};

export async function updateNote(req, res, next){
    try {
        const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Note Updated Successfully"
        })
    } catch (error) {
        next(error)
    }
}

export async function deleteNote(req, res, next){
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Note Deleted Successfully"
        })
    } catch (error) {
        next(error)
    }
}