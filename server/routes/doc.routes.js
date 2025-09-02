const express = require("express");
const {auth} = require("../middlewares/authMiddleware");
// const roles = require("../middlewares/authRoles");
const { summarizeText, generateTags, embedText } = require("../services/gemini");
const Document = require("../model/document.model");
const router = express.Router();


router.get("/doc-cl",(req,res)=>{

    res.send("doc Routes ")
})

router.post("/create", auth, async (req, res) => {
    try {
      const { title, content, tags } = req.body;
    //   console.log(req.body);
  
      const [summary, aiTags, embedding] = await Promise.all([
        summarizeText(content).catch(() => ""),
        generateTags(content).catch(() => []),
        embedText(`${title}\n\n${content}`).catch(() => []),
      ]);

    // console.log("summary",summary)
      const doc = await Document.create({
        title,
        content,
        tags: Array.from(new Set([...(tags || []), ...(aiTags || [])])),
        summary,
        createdBy: req.user.id,
        embedding,
      });
  
      res.status(201).json(doc);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong", error });
    }
  });
  
  router.get("/", auth, async (req, res) => {
    try {
      const { tag, author, limit = 20, page = 1 } = req.query; // use query instead of body
  
      const filters = {};
      if (tag) {
        filters.tags = tag;
      }
      if (author) {
        filters.createdBy = author;
      }
  
      const parsedLimit = parseInt(limit, 10) || 20;
      const parsedPage = parseInt(page, 10) || 1;
      const skip = (parsedPage - 1) * parsedLimit;
  
      const docs = await Document.find(filters)
        .populate("createdBy", "name role")
        .sort({ updatedAt: -1 }) // use -1 as number
        .limit(parsedLimit)
        .skip(skip);
  
      res.json(docs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
router.get('/:id', auth, async (req,res)=> {
    try {
      const doc = await Document.findById(req.params.id).populate('createdBy','name role');
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json(doc);
    } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
  });

  router.post("/docs/:id/summarize", async (req, res) => {
    try {
      const doc = await Document.findById(req.params.id);
      if (!doc) return res.status(404).json({ error: "Document not found" });
  
     
      const summary = await summarizeText(doc.content);
  
      doc.summary = summary;
      await doc.save();
  
      res.json({ summary });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Update (owner or admin)
  router.patch('/:id', auth, async (req,res) => {
    try {
      const doc = await Document.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Not found' });
      const isOwner = doc.createdBy.toString() === req.user.id;
      if (!isOwner && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  
      const { title, content, tags } = req.body;
      if (title !== undefined) doc.title = title;
      if (content !== undefined) doc.content = content;
      if (tags !== undefined) doc.tags = tags;
  
      // versioning
      const newVersion = (doc.versions.at(-1)?.version || 0) + 1;
      const summary = content ? await summarizeText(content).catch(()=>doc.summary) : doc.summary;
      const embedding = (content || title) ? await embedText(`${doc.title}\n\n${doc.content}`).catch(()=>doc.embedding) : doc.embedding;
  
      doc.summary = summary;
      doc.embedding = embedding;
      doc.versions.push({ version: newVersion, title: doc.title, content: doc.content, summary: doc.summary, tags: doc.tags, updatedBy: req.user.id });
      await doc.save();
      res.json(doc);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Delete (owner or admin)
  router.delete('/:id', auth, async (req,res) => {
    try {
      const doc = await Document.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Not found' });
      const isOwner = doc.createdBy.toString() === req.user.id;
      if (!isOwner && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
      await doc.deleteOne();
      res.json({ ok: true });
    } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
  });
  router.post('/:id/tags', auth, async (req,res) => {
    try {
      const doc = await Document.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Not found' });
      const aiTags = await generateTags(doc.content).catch(()=>[]);
      doc.tags = Array.from(new Set([...(doc.tags||[]), ...(aiTags||[])]));
      await doc.save();
      res.json({ tags: doc.tags });
    } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
  });
module.exports = router;